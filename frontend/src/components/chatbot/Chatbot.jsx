import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaChevronDown, FaChevronUp, FaPaperPlane } from 'react-icons/fa';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your hostel assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.post(
        'http://localhost:8000/api/chatbot/query',
        { query: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add bot response
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      // Detailed error message based on the response
      let errorMessage = "Sorry, I'm having trouble answering right now.";
      
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = error.response.data.message || 
            "The chatbot service is currently unavailable. Please try again later.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message || 
            "I couldn't understand your request. Please try rephrasing.";
        }
      }
      
      // Add error message
      const errorBotMessage = { 
        text: errorMessage, 
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate example questions
  const exampleQuestions = [
    "What's on the menu today?",
    "What are the mess timings?",
    "Is the night canteen open?",
    "What's my room number?",
    "Show me recent announcements",
    "What is the status of my complaints?"
  ];

  const handleExampleClick = (question) => {
    setInput(question);
    // Focus the input after setting the question
    document.getElementById('chatbot-input').focus();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
        >
          <FaRobot className="text-lg" />
          <span>Hostel Assistant</span>
        </button>
      )}

      {/* Chatbot dialog */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col overflow-hidden" style={{ width: '380px', maxHeight: '600px' }}>
          {/* Chatbot header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot className="text-lg" />
              <h3 className="font-medium">Hostel Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-200"
              >
                {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Chatbot body - hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Message container */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ height: '350px' }}>
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`rounded-lg px-4 py-2 max-w-[85%] ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : message.isError 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Example questions */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 bg-gray-100 border-t border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(question)}
                        className="text-xs bg-white border border-gray-300 rounded-full px-2 py-1 hover:bg-gray-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chatbot input */}
              <form onSubmit={handleSubmit} className="p-3 border-t">
                <div className="flex">
                  <input
                    id="chatbot-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white p-2 rounded-r-lg disabled:opacity-50"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Chatbot;
