import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function ExcelTemplateGenerator() {
  const generateTemplate = () => {
    // Create sample data
    const sampleData = [
      {
        'Student Name': 'Aryan Sharma',
        'Reg No.': '23BEY10100',
        'Email': '23bey10100@vitbhopal.ac.in',
        'Contact No.': '9800000020',
        'Hostel Block': 'Boys Hostel Block 6',
        'Room Type': '3 Bedded',
        'Room Number': 'A-101',
        'Mess': 'JMB Mess'
      },
      {
        'Student Name': 'Rohan Verma',
        'Reg No.': '23BEY10101',
        'Email': '23bey10101@vitbhopal.ac.in',
        'Contact No.': '9800000021',
        'Hostel Block': 'Boys Hostel Block 6',
        'Room Type': '4 Bedded',
        'Room Number': 'B-112',
        'Mess': 'Safal Mess'
      }
    ];
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(sampleData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Template');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save the file
    saveAs(data, 'student_import_template.xlsx');
  };

  return (
    <button
      onClick={generateTemplate}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Download Template
    </button>
  );
}

export default ExcelTemplateGenerator;
