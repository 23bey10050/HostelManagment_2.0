import { useState } from 'react';

function FullMenuModal({ isOpen, onClose, menuData }) {
  const [activeTab, setActiveTab] = useState('breakfast');
  
  if (!isOpen) return null;

  const tabs = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'hiTea', label: 'Hi-Tea' },
    { id: 'dinner', label: 'Dinner' }
  ];

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  
  // Get current day
  const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold">VIT Bhopal - Weekly Mess Menu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="border-b">
          <div className="flex overflow-x-auto p-2 bg-gray-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium text-sm rounded-md mx-1 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-auto flex-grow p-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50 w-1/8"></th>
                {days.map(day => (
                  <th key={day} className={`border p-2 text-center w-1/8 ${day === today ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <div className="font-semibold">{day}</div>
                    {day === today && <div className="text-xs text-blue-500 font-medium">TODAY</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menuData[activeTab] && (
                <tr>
                  <td className="border p-2 font-semibold bg-gray-50 align-top">
                    {activeTab === 'breakfast' && 'Breakfast'}
                    {activeTab === 'lunch' && 'Lunch'}
                    {activeTab === 'hiTea' && 'Hi-Tea'}
                    {activeTab === 'dinner' && 'Dinner'}
                  </td>
                  {days.map(day => (
                    <td key={day} className={`border p-2 align-top ${day === today ? 'bg-blue-50' : ''}`}>
                      <ul className="list-disc pl-4 space-y-1">
                        {menuData[activeTab][day]?.map((item, idx) => (
                          <li key={idx} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          Menu is subject to change. Please contact the mess manager for any queries.
        </div>
      </div>
    </div>
  );
}

export default FullMenuModal;
