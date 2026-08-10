import { GoogleGenerativeAI } from '@google/generative-ai';
import Student from '../models/Student.js';
import Complaint from '../models/Complaint.js';
import Announcement from '../models/Announcement.js';
import CanteenStatus from '../models/CanteenStatus.js';
import dotenv from 'dotenv';

// Make sure environment variables are loaded
dotenv.config();

// Get the API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// Debug logging to check if API key is available
console.log('Gemini API Key available:', !!API_KEY);

// Initialize the Gemini API with proper error handling
let genAI;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
  console.log('Gemini API initialized successfully');
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

export const queryChatbot = async (req, res) => {
  try {
    const { query } = req.body;
    const { email } = req.user;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Check if API key is available
    if (!API_KEY) {
      console.error('GEMINI_API_KEY is not defined in environment variables');
      return res.status(500).json({ 
        message: 'Chatbot service is not properly configured. Please contact support.'
      });
    }

    // Check if genAI was initialized properly
    if (!genAI) {
      console.error('Gemini API was not initialized');
      return res.status(500).json({ 
        message: 'Chatbot service is currently unavailable. Please try again later.'
      });
    }

    try {
      // Get system data to give context to the model
      const contextData = await getContextData(email);
      
      // Create prompt with context and user query
      const prompt = createPrompt(contextData, query);

      // Call Gemini API with the 'gemini-2.0-flash' model instead of 'gemini-pro'
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      res.status(200).json({ response });
    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      return res.status(500).json({ 
        message: 'Unable to generate a response at this time. Please try again later.',
        error: aiError.message 
      });
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      message: 'Error processing chatbot query', 
      error: error.message 
    });
  }
};

// Get data from various sources to provide context to the model
async function getContextData(userEmail) {
  try {
    // Get student info
    const student = await Student.findOne({ email: userEmail });
    
    // Get recent announcements
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get student's complaints
    const complaints = await Complaint.find({ 
      student: student?._id 
    }).sort({ createdAt: -1 });
    
    // Get canteen status
    const canteenStatus = await CanteenStatus.findOne() || { 
      isOpen: false, 
      message: "Night canteen is currently closed." 
    };
    
    // Get mess menu (this would be from your database in a real implementation)
    const messMenu = getMessMenu();
    
    // Mess timings
    const messTimings = {
      breakfast: "7:30 AM - 9:30 AM",
      lunch: "12:30 PM - 2:00 PM",
      snacks: "5:00 PM - 6:00 PM",
      dinner: "7:30 PM - 9:00 PM"
    };
    
    return {
      student,
      announcements,
      complaints,
      canteenStatus,
      messMenu,
      messTimings
    };
  } catch (error) {
    console.error('Error getting context data:', error);
    throw error;
  }
}

// Create a structured prompt for Gemini
function createPrompt(contextData, userQuery) {
  const { student, announcements, complaints, canteenStatus, messMenu, messTimings } = contextData;
  
  let systemPrompt = `
You are a helpful assistant for the hostel management platform. You have access to the following information about the student and hostel:

STUDENT INFORMATION:
Name: ${student?.name || 'Not available'}
Registration Number: ${student?.registrationNumber || 'Not available'}
Email: ${student?.email || 'Not available'}
Room Number: ${student?.roomNumber || 'Not available'}
Hostel Block: ${student?.hostelBlock || 'Not available'}
Phone: ${student?.phoneNumber || 'Not available'}
Mess: ${student?.mess || 'Not available'}

RECENT ANNOUNCEMENTS:
${announcements.map(a => `- ${a.title}: ${a.content} (Posted: ${new Date(a.createdAt).toLocaleDateString()})`).join('\n') || 'No recent announcements.'}

STUDENT'S COMPLAINTS:
${complaints.map(c => `- Category: ${c.category}, Status: ${c.status}, Description: ${c.description} (Date: ${new Date(c.createdAt).toLocaleDateString()})`).join('\n') || 'No complaints found.'}

NIGHT CANTEEN STATUS:
${canteenStatus.isOpen ? 'OPEN' : 'CLOSED'}
Message: ${canteenStatus.message}

MESS MENU:
Breakfast:
${messMenu.breakfast.join(", ")}

Lunch:
${messMenu.lunch.join(", ")}

Snacks:
${messMenu.snacks.join(", ")}

Dinner:
${messMenu.dinner.join(", ")}

MESS TIMINGS:
Breakfast: ${messTimings.breakfast}
Lunch: ${messTimings.lunch}
Snacks: ${messTimings.snacks}
Dinner: ${messTimings.dinner}

INSTRUCTIONS:
1. Only answer questions based on the data provided above. 
2. If asked about information not in the data provided, politely state that you don't have that information.
3. Don't make up any information about the hostel, students, or facilities.
4. Keep responses concise and to the point.
5. Be helpful and friendly.

User query: ${userQuery}
`;

  return systemPrompt;
}

// Sample mess menu (in a real app, this would come from the database)
function getMessMenu() {
  return {
    breakfast: [
      "Idli with Sambar and Chutney", 
      "Poha", 
      "Bread with Jam/Butter", 
      "Boiled Eggs", 
      "Tea/Coffee"
    ],
    lunch: [
      "Rice", 
      "Dal", 
      "Roti", 
      "Seasonal Vegetable Curry", 
      "Curd", 
      "Pickle"
    ],
    snacks: [
      "Samosa/Sandwich", 
      "Tea/Coffee",
      "Biscuits"
    ],
    dinner: [
      "Rice", 
      "Dal", 
      "Roti", 
      "Paneer/Chicken Curry (alternating days)", 
      "Dessert (occasionally)"
    ]
  };
}
