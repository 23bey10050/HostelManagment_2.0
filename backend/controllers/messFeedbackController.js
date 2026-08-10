import SystemSetting from '../models/SystemSetting.js';
import Student from '../models/Student.js';
import MessFeedback from '../models/MessFeedback.js';
import axios from 'axios';

// Submit feedback (for students)
export const submitFeedback = async (req, res) => {
  try {
    // Check if feedback system is enabled
    const feedbackEnabled = await SystemSetting.findOne({ key: 'messFeedbackEnabled' });
    if (!feedbackEnabled || feedbackEnabled.value !== true) {
      return res.status(403).json({ message: 'Feedback submission is currently disabled' });
    }

    // Get student from token
    const studentEmail = req.user.email;
    const student = await Student.findOne({ email: studentEmail });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify the mess in request matches student's assigned mess
    if (req.body.mess !== student.mess) {
      return res.status(400).json({ 
        message: 'You can only submit feedback for your assigned mess' 
      });
    }

    // Check if student already submitted feedback for this meal type
    const existingFeedback = await MessFeedback.findOne({
      student: student._id,
      mealType: req.body.mealType
    });

    if (existingFeedback) {
      return res.status(409).json({ 
        message: 'You have already submitted feedback for this meal type' 
      });
    }

    // Create feedback
    const feedback = new MessFeedback({
      student: student._id,
      ...req.body
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get feedback status (enabled/disabled)
export const getFeedbackStatus = async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: 'messFeedbackEnabled' });
    const isEnabled = setting ? setting.value : false;
    
    res.json({ enabled: isEnabled });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my submitted feedback types (for students)
export const getMySubmissions = async (req, res) => {
  try {
    const studentEmail = req.user.email;
    const student = await Student.findOne({ email: studentEmail });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const feedbacks = await MessFeedback.find({ student: student._id });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle feedback system (for staff/warden)
export const toggleFeedbackSystem = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    await SystemSetting.findOneAndUpdate(
      { key: 'messFeedbackEnabled' },
      { key: 'messFeedbackEnabled', value: enabled, updatedBy: req.user.email },
      { upsert: true, new: true }
    );
    
    // When feedback is disabled and enabled again, clear previous submissions
    if (enabled) {
      try {
        await MessFeedback.deleteMany({});
        console.log('Cleared previous feedback submissions for new cycle');
      } catch (clearError) {
        console.error('Error clearing previous feedback:', clearError);
      }
    }
    
    res.json({ 
      message: `Feedback system ${enabled ? 'enabled' : 'disabled'}`,
      resetSubmissions: enabled
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback analytics (for staff/warden)
export const getFeedbackAnalytics = async (req, res) => {
  try {
    // Overall ratings
    const overallStats = await MessFeedback.aggregate([
      {
        $group: {
          _id: null,
          foodQualityAvg: { $avg: '$foodQuality' },
          cleanlinessAvg: { $avg: '$cleanliness' },
          serviceQualityAvg: { $avg: '$serviceQuality' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Mess-wise breakdown
    const messwiseStats = await MessFeedback.aggregate([
      {
        $group: {
          _id: '$mess',
          foodQualityAvg: { $avg: '$foodQuality' },
          cleanlinessAvg: { $avg: '$cleanliness' },
          serviceQualityAvg: { $avg: '$serviceQuality' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Meal-type breakdown
    const mealTypeStats = await MessFeedback.aggregate([
      {
        $group: {
          _id: '$mealType',
          foodQualityAvg: { $avg: '$foodQuality' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Rating distribution
    const ratingDistribution = await MessFeedback.aggregate([
      {
        $facet: {
          foodQuality: [
            { $bucket: { groupBy: '$foodQuality', boundaries: [1, 2, 3, 4, 5, 6], default: 'Other' } }
          ],
          cleanliness: [
            { $bucket: { groupBy: '$cleanliness', boundaries: [1, 2, 3, 4, 5, 6], default: 'Other' } }
          ],
          serviceQuality: [
            { $bucket: { groupBy: '$serviceQuality', boundaries: [1, 2, 3, 4, 5, 6], default: 'Other' } }
          ]
        }
      }
    ]);

    res.json({
      overall: overallStats[0] || { foodQualityAvg: 0, cleanlinessAvg: 0, serviceQualityAvg: 0, count: 0 },
      messwise: messwiseStats,
      mealType: mealTypeStats,
      ratingDistribution: ratingDistribution[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedback responses (for staff/warden)
export const getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10, mess, mealType } = req.query;
    
    let query = {};
    if (mess) query.mess = mess;
    if (mealType) query.mealType = mealType;

    const feedbacks = await MessFeedback.find(query)
      .populate('student', 'name email registrationNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await MessFeedback.countDocuments(query);

    res.json({
      feedbacks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalFeedbacks: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get AI analysis of mess feedback data
export const getAIFeedbackAnalysis = async (req, res) => {
  try {
    // Get all feedback data
    const feedbacks = await MessFeedback.find({})
      .populate('student', 'name email registrationNumber')
      .sort({ createdAt: -1 })
      .exec();

    if (feedbacks.length === 0) {
      return res.status(200).json({ 
        analysis: "There is not enough feedback data to generate an analysis yet."
      });
    }

    // Prepare the data for Gemini
    const messNames = [...new Set(feedbacks.map(f => f.mess))];
    
    // Group feedback by mess
    const messFeedbackMap = {};
    messNames.forEach(mess => {
      messFeedbackMap[mess] = feedbacks.filter(f => f.mess === mess);
    });

    // Format the data for Gemini
    let promptText = "Analyze the following mess feedback data and provide insights:\n\n";
    
    for (const mess of messNames) {
      const messFeedbacks = messFeedbackMap[mess];
      promptText += `## ${mess} (${messFeedbacks.length} feedback submissions)\n\n`;
      
      // Group by meal type
      const mealTypeCounts = {};
      messFeedbacks.forEach(f => {
        mealTypeCounts[f.mealType] = (mealTypeCounts[f.mealType] || 0) + 1;
      });
      
      promptText += "Meal type distribution:\n";
      for (const [mealType, count] of Object.entries(mealTypeCounts)) {
        promptText += `- ${mealType}: ${count} submissions\n`;
      }
      
      // Add rating averages
      const avgFoodQuality = messFeedbacks.reduce((sum, f) => sum + f.foodQuality, 0) / messFeedbacks.length;
      const avgCleanliness = messFeedbacks.reduce((sum, f) => sum + f.cleanliness, 0) / messFeedbacks.length;
      const avgServiceQuality = messFeedbacks.reduce((sum, f) => sum + f.serviceQuality, 0) / messFeedbacks.length;
      
      promptText += `\nAverage ratings (out of 5):\n`;
      promptText += `- Food Quality: ${avgFoodQuality.toFixed(2)}\n`;
      promptText += `- Cleanliness: ${avgCleanliness.toFixed(2)}\n`;
      promptText += `- Service Quality: ${avgServiceQuality.toFixed(2)}\n\n`;
      
      // Add some sample comments
      const comments = messFeedbacks
        .filter(f => f.comments?.trim())
        .map(f => f.comments.trim());
      
      if (comments.length > 0) {
        promptText += "Sample comments:\n";
        // Take up to 10 random comments
        const sampleComments = comments.sort(() => 0.5 - Math.random()).slice(0, 10);
        sampleComments.forEach(comment => {
          promptText += `- "${comment}"\n`;
        });
        promptText += "\n";
      }
    }
    
    // Add specific questions for the AI to address
    promptText += `\nBased on this data, please provide:\n`;
    promptText += `1. A comparison of the different messes (which is performing best/worst and why)\n`;
    promptText += `2. The main strengths and issues for each mess\n`;
    promptText += `3. Key improvement areas across all messes\n`;
    promptText += `4. Any emerging patterns in feedback (e.g., specific meals that receive poor ratings)\n`;
    promptText += `5. Overall recommendations for mess management\n\n`;
    promptText += `Please format your response with clear headings and bullet points for easy readability. Limit your response to about 800 words.`;

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: promptText }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Extract the generated text
    let analysisText = "";
    if (response.data.candidates && response.data.candidates.length > 0) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        analysisText = candidate.content.parts[0].text;
      }
    }
    
    if (!analysisText) {
      analysisText = "Unable to generate analysis. Please try again later.";
    }

    res.status(200).json({ analysis: analysisText });
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    res.status(500).json({ 
      message: 'Failed to generate AI analysis',
      error: error.response?.data || error.message
    });
  }
};
