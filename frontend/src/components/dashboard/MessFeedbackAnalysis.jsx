import { useState, useEffect } from 'react';
import axios from 'axios';

function MessFeedbackAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.get(
        '/api/mess-feedback/automated-analysis',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setAnalysis(response.data.analysis);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      setError('Failed to get automated analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  // Function to format the analysis text with proper HTML
  const formatAnalysis = (text) => {
    if (!text) return '';
    
    // Find and highlight percentages with color based on value
    const highlightPercentages = (text) => {
      return text.replace(/(\d+(?:\.\d+)?)%/g, (match, percentage) => {
        const num = parseFloat(percentage);
        let colorClass;
        
        if (num >= 80) colorClass = 'text-green-600 font-bold';
        else if (num >= 60) colorClass = 'text-blue-600 font-bold';
        else if (num >= 40) colorClass = 'text-yellow-600 font-bold';
        else colorClass = 'text-red-600 font-bold';
        
        return `<span class="${colorClass}">${match}</span>`;
      });
    };
    
    // Highlight rating numbers (1-5)
    const highlightRatings = (text) => {
      return text.replace(/\b([1-5])(\.\d+)? (stars?|★|out of 5)\b/gi, (match, rating, decimal, unit) => {
        const num = parseFloat(rating + (decimal || ''));
        let colorClass;
        
        if (num >= 4.5) colorClass = 'text-green-600 font-bold';
        else if (num >= 3.5) colorClass = 'text-blue-600 font-bold';
        else if (num >= 2.5) colorClass = 'text-yellow-600 font-bold';
        else colorClass = 'text-red-600 font-bold';
        
        return `<span class="${colorClass}">${match}</span>`;
      });
    };
    
    // Convert markdown-like headings to HTML with colored backgrounds
    let formattedText = text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 pb-2 border-b-2 border-blue-300 text-blue-800">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 text-blue-700 bg-blue-50 px-2 py-1 rounded">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-blue-600">$1</h3>')
      
      // Convert bullet points with colored markers
      .replace(/^\- (.+)$/gim, '<div class="flex items-start mb-1"><div class="h-5 w-5 mt-0.5 mr-2 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">•</div><div class="flex-1">$1</div></div>')
      .replace(/^\* (.+)$/gim, '<div class="flex items-start mb-1"><div class="h-5 w-5 mt-0.5 mr-2 flex items-center justify-center bg-green-100 rounded-full text-green-500">•</div><div class="flex-1">$1</div></div>')
      
      // Convert numbered list items with colored numbers
      .replace(/^(\d+)\. (.+)$/gim, '<div class="flex items-start mb-2"><div class="h-5 w-5 mr-2 flex items-center justify-center bg-purple-100 rounded-full text-purple-600 text-sm font-bold">$1</div><div class="flex-1">$2</div></div>')
      
      // Convert paragraphs
      .replace(/\n\n/g, '</p><p class="my-3">')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Apply color highlighting to percentages and ratings
    formattedText = highlightPercentages(formattedText);
    formattedText = highlightRatings(formattedText);
    
    // Wrap in paragraph tags
    formattedText = `<p class="my-3">${formattedText}</p>`;
    
    // Fix lists by properly containing them
    formattedText = formattedText.replace(/<div class="flex items-start mb-1"><div class="h-5 w-5 mt-0\.5 mr-2 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">•<\/div><div class="flex-1">(.+?)<\/div><\/div>(?:\s*<div class="flex items-start mb-1"><div class="h-5 w-5 mt-0\.5 mr-2 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">•<\/div><div class="flex-1">(.+?)<\/div><\/div>)+/gs, 
      match => `<div class="bg-gray-50 p-3 rounded-lg my-3 border border-gray-100">${match}</div>`);
    
    // Add highlighting to sections about specific messes
    ['JMB Mess', 'Safal Mess', 'Mayuri Mess'].forEach(mess => {
      const messRegex = new RegExp(`(\\b${mess}\\b)`, 'g');
      let bgColor, textColor;
      
      if (mess === 'JMB Mess') {
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
      } else if (mess === 'Safal Mess') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
      } else if (mess === 'Mayuri Mess') {
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
      }
      
      formattedText = formattedText.replace(messRegex, 
        `<span class="font-semibold ${bgColor} ${textColor} px-2 py-0.5 rounded">$1</span>`);
    });
    
    return formattedText;
  };

  // Extract key insights to show as a summary
  const extractKeyInsights = (text) => {
    if (!text) return null;
    
    // Extract the best mess
    const bestMessMatch = text.match(/(?:best|highest rated|top performing) mess(?: is)? (?:is |appears to be )?(?:the )?([A-Za-z\s]+Mess)/i);
    const bestMess = bestMessMatch ? bestMessMatch[1].trim() : null;
    
    // Extract improvement areas
    const improvementSection = text.match(/(?:improvements?|areas? for improvements?)[\s\S]*?(?:\n\n|\n#)/i);
    const improvements = improvementSection 
      ? improvementSection[0].match(/[-*]\s+([^\n]+)/g)?.map(item => item.replace(/[-*]\s+/, '').trim()).slice(0, 3)
      : [];
    
    // Extract overall rating
    const overallRatingMatch = text.match(/overall(?:\s+[a-z]+){0,3}\s+rating(?:\s+[a-z]+){0,3}\s+(?:is |of |at )?\s*(\d+\.?\d*)/i);
    const overallRating = overallRatingMatch ? parseFloat(overallRatingMatch[1]) : null;
    
    // Extract main strengths
    const strengthsSection = text.match(/(?:strengths|positives|highlights)[\s\S]*?(?:\n\n|\n#)/i);
    const strengths = strengthsSection 
      ? strengthsSection[0].match(/[-*]\s+([^\n]+)/g)?.map(item => item.replace(/[-*]\s+/, '').trim()).slice(0, 3)
      : [];
    
    return {
      bestMess,
      improvements,
      overallRating,
      strengths
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Generating automated analysis of mess feedback...</p>
          <p className="text-xs text-gray-500 mt-2">This may take a moment as we process all feedback data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const insights = extractKeyInsights(analysis);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Automated Feedback Analysis</h2>
        <div className="flex items-center gap-4">
          {lastRefreshed && (
            <span className="text-xs text-gray-500">
              Last updated: {lastRefreshed.toLocaleString()}
            </span>
          )}
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            {loading ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>
      </div>

      {/* Key Insights Summary Cards */}
      {insights && (
        <div className="mb-8 border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Best Mess Card */}
            {insights.bestMess && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                <h4 className="text-sm uppercase tracking-wider text-blue-600 mb-2">Top Performing Mess</h4>
                <p className="text-xl font-bold text-blue-800">{insights.bestMess}</p>
              </div>
            )}
            
            {/* Overall Rating Card */}
            {insights.overallRating && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 shadow-sm">
                <h4 className="text-sm uppercase tracking-wider text-purple-600 mb-2">Overall Rating</h4>
                <div className="flex items-center">
                  <p className="text-xl font-bold text-purple-800">{insights.overallRating.toFixed(1)}</p>
                  <div className="ml-2 flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(insights.overallRating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Improvement Areas */}
            {insights.improvements && insights.improvements.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100 shadow-sm">
                <h4 className="text-sm uppercase tracking-wider text-amber-600 mb-2">Top Improvement Areas</h4>
                <ul className="text-sm">
                  {insights.improvements.map((item, index) => (
                    <li key={index} className="mb-1 flex items-start">
                      <span className="inline-block w-4 h-4 rounded-full bg-amber-200 text-amber-700 text-xs flex items-center justify-center mr-2 mt-0.5">{index + 1}</span>
                      <span className="text-amber-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Analysis */}
      <div className="prose max-w-none bg-white p-6 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Complete Analysis</h3>
        <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }} />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Analysis automatically generated based on collected feedback data.
        </p>
      </div>
    </div>
  );
}

export default MessFeedbackAnalysis;
