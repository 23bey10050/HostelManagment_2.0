import { useState } from 'react';

function FeedbackNotification() {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  return (
    <div className="mb-6 relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4 shadow-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0 p-3 bg-white/20 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold">Mess Feedback Now Open!</h3>
            <button 
              onClick={() => setDismissed(true)}
              className="text-white/80 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="mt-1">Your opinions matter! The mess feedback system is currently active. Please scroll down to share your dining experience and help us improve the mess services.</p>
          <a 
            href="#mess-feedback" 
            className="mt-3 inline-block px-4 py-2 bg-white text-blue-600 rounded font-medium hover:bg-blue-50 transition-colors"
          >
            Submit Feedback
          </a>
        </div>
      </div>
      
      {/* Decorative dots */}
      <div className="absolute top-2 right-2 flex space-x-1">
        <div className="w-1 h-1 rounded-full bg-white/30"></div>
        <div className="w-1 h-1 rounded-full bg-white/30"></div>
        <div className="w-1 h-1 rounded-full bg-white/30"></div>
      </div>
    </div>
  );
}

export default FeedbackNotification;
