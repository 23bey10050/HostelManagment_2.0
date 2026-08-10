import Student from '../models/Student.js';
import xlsx from 'xlsx';

export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const students = await Student.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Student.countDocuments(searchQuery);

    res.status(200).json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalStudents: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkAddStudents = async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Map Excel columns to match our schema
    const formattedData = data.map(row => {
      // Set default hostelBlock if not provided
      const hostelBlock = row['Hostel Block'] || row[4] || 'Boys Hostel Block 6';
      
      return {
        name: row['Student Name'] || row[0] || '',
        registrationNumber: row['Reg No.'] || row[1] || '',
        email: row['Email'] || row[2] || '',
        phoneNumber: row['Contact No.'] || row[3] || '',
        hostelBlock: hostelBlock,
        roomType: row['Room Type'] || row[5] || '',
        roomNumber: row['Room Number'] || row[6] || '',
        mess: row['Mess'] || row[7] || ''
      };
    });

    // Validate all required fields before insertion
    const validationErrors = [];
    formattedData.forEach((student, index) => {
      if (!student.name) validationErrors.push(`Row ${index + 1}: Missing name`);
      if (!student.registrationNumber) validationErrors.push(`Row ${index + 1}: Missing registration number`);
      if (!student.email) validationErrors.push(`Row ${index + 1}: Missing email`);
      if (!student.roomType) validationErrors.push(`Row ${index + 1}: Missing room type`);
      if (!student.roomNumber) validationErrors.push(`Row ${index + 1}: Missing room number`);
      if (!student.mess) validationErrors.push(`Row ${index + 1}: Missing mess`);
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation errors in uploaded data', 
        errors: validationErrors 
      });
    }

    const students = await Student.insertMany(formattedData);
    res.status(201).json(students);
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    // Don't allow email or registration number changes
    delete update.email;
    delete update.registrationNumber;

    const student = await Student.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleStudentAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDisabled } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      id,
      { 
        isDisabled,
        disabledAt: isDisabled ? new Date() : null,
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If disabling access, revoke Firebase tokens
    if (isDisabled) {
      try {
        const firebaseUser = await firebaseAdmin.auth().getUserByEmail(student.email);
        await firebaseAdmin.auth().revokeRefreshTokens(firebaseUser.uid);
      } catch (error) {
        console.error('Firebase token revocation error:', error);
      }
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
