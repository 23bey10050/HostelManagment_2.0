import { useState, useEffect } from 'react';
import FullMenuModal from './FullMenuModal';

function MessMenu() {
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [todayMenu, setTodayMenu] = useState({
    breakfast: [],
    lunch: [],
    hiTea: [],
    dinner: []
  });

  // Define the weekly menu data
  const messMenu = {
    breakfast: {
      MONDAY: ['USAL', 'POHA', 'JALEBI', 'KACHUMAR SALAD', 'BANANA', 'BREAD | BUTTER', 'TEA | COFFEE | MILK'],
      TUESDAY: ['DAL', 'PAKWAN', 'MIXED FRUITS', 'BREAD | BUTTER', 'TEA | COFFEE | MILK'],
      WEDNESDAY: ['POORI', 'KALE CHANA LATPATA', 'ALOO BADA', 'BANANA', 'BREAD | BUTTER | JAM', 'TEA | COFFEE | MILK'],
      THURSDAY: ['UPMA', 'MASALA DOSA', 'SAMBHAR', 'CHICKPEAS SALAD', 'MIXED FRUITS', 'BREAD | BUTTER | JAM', 'TEA | COFFEE | MILK'],
      FRIDAY: ['TOMATO UTTPAM', 'SAMBHAR', 'CHUTNEY', 'BANANA', 'BREAD | BUTTER | JAM', 'TEA | COFFEE | MILK'],
      SATURDAY: ['CHOLE', 'BREAD KULCHE', 'KIDNEY BEAN SALAD', 'MIXED FRUITS', 'BREAD | BUTTER | JAM', 'TEA | COFFEE | MILK'],
      SUNDAY: ['ALOO PARATHA', 'CHILLED CHILLI YOGURT', 'BANANA', 'BREAD | BUTTER | JAM', 'TEA | COFFEE | MILK']
    },
    lunch: {
      MONDAY: ['MOONG DAL PALAK', 'KADDU MASALA', 'RASAM', 'RICE/JEERA RICE', 'ROTI', 'ACHAR', 'SALAD', 'TADKA BUTTERMILK'],
      TUESDAY: ['CHOLE MASALA', 'DAL FRY', 'DUM ALOO', 'RICE/MASALA RICE', 'ROTI', 'ACHAR', 'SALAD', 'WATERMELON JUICE'],
      WEDNESDAY: ['ALOO METHI', 'CHOWLA MASALA', 'YELLOW DAL', 'RICE/MATAR PULAO', 'ROTI', 'ACHAR', 'SALAD', 'PUDINA CHACH'],
      THURSDAY: ['KADI PAKODA', 'KHATTA MEETHA MOONG', 'RICE/TADKA RICE', 'ROTI', 'ACHAR', 'SALAD', 'VEGETABLE RAITA', 'MANGO KERI PANA'],
      FRIDAY: ['TANG/SHARBAT', 'LOKI CHANA DAL', 'RAJMA MASALA', 'RICE/JEERA RICE', 'ROTI', 'ACHAR', 'SALAD', 'FRYUMS'],
      SATURDAY: ['PANEER JALFRIZI', 'MOONG MOGAR', 'CUCUMBER RAITA', 'BIRYANI', 'ROTI', 'ACHAR', 'SALAD', 'PAPAD'],
      SUNDAY: ['JAIPURI PANEER', 'PUNCHMELI DALA', 'GATTE KI SABJI', 'LAHSUN CHUTNEY', 'CHURMA', 'PULAO', 'TANG/SHARBAT', 'BATI', 'PAPAD']
    },
    hiTea: {
      MONDAY: ['ASSORTA PASTA WITH HOME MADE', 'TEA | COFFEE'],
      TUESDAY: ['KACHORI/ALOO', 'RED CHUTNEY', 'TEA | COFFEE | MILK'],
      WEDNESDAY: ['BREAD PAKODA', 'CHUTNEY', 'TEA | COFFEE | MILK'],
      THURSDAY: ['NOODLES', 'TEA | COFFEE | MILK'],
      FRIDAY: ['SAMOSA', 'CHUTNEY', 'TEA | COFFEE | MILK'],
      SATURDAY: ['BHUTTE KA KEES', 'TEA | COFFEE | MILK'],
      SUNDAY: ['PANI PURI', 'TEA | COFFEE | MILK']
    },
    dinner: {
      MONDAY: ['DAHI GILKI OR', 'DAL TADKA', 'RICE', 'ROTI', 'ACHAR', 'SALAD', 'FRYUMS'],
      TUESDAY: ['PALAK PANEER', 'GOBHI MASALA OR SEASONAL VEG.', 'VEGETABLE RASAM', 'MOONG DAL', 'RICE/TADKA RICE', 'ROTI', 'ACHAR', 'SALAD'],
      WEDNESDAY: ['KABULI CHANA', 'BHINDI MASALA OR SEASONAL VEG.', 'DAL MAKHNI', 'RICE', 'ROTI', 'ACHAR', 'SALAD', 'FRYUMS'],
      THURSDAY: ['MANCHURIAN', 'KAKDI ANGOOR OR SEASONAL VEG.', 'DAL', 'FRIED RICE', 'ROTI', 'ACHAR', 'SALAD', 'HALWA'],
      FRIDAY: ['SEV TAMATAR', 'TENSI MASALA OR SEASONAL VEG.', 'BUTTERMILK', 'DAL RICE KHICHDI', 'ROTI', 'ACHAR', 'SALAD', 'FRYUMS'],
      SATURDAY: ['ALOO PYAZ', 'TADKA BESAN', 'DAL PALAK SHORBA', 'RICE/JEERA RICE', 'ROTI', 'ACHAR', 'SALAD', 'FRYUMA'],
      SUNDAY: ['RAMBHAJI', 'POORI', 'CHOLE MASALA', 'ALOO TIKKI', 'RICE/JEERA RICE', 'ACHAR', 'SALAD', 'DAHI']
    }
  };

  useEffect(() => {
    // Get current day of the week
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = days[new Date().getDay()];
    setCurrentDay(today);

    // Set today's menu
    setTodayMenu({
      breakfast: messMenu.breakfast[today] || [],
      lunch: messMenu.lunch[today] || [],
      hiTea: messMenu.hiTea[today] || [],
      dinner: messMenu.dinner[today] || []
    });
  }, []);

  // Get current mealtime based on time of day
  const getCurrentMeal = () => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 10) return 'breakfast';
    if (hour >= 12 && hour < 15) return 'lunch';
    if (hour >= 16 && hour < 18) return 'hiTea';
    if (hour >= 19 && hour < 22) return 'dinner';
    return null;
  };

  const currentMeal = getCurrentMeal();

  // Helper to render a meal section
  const renderMealSection = (title, items, isActive) => (
    <div className={`rounded-lg overflow-hidden shadow-sm border ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className={`${isActive ? 'bg-blue-500 text-white' : 'bg-gray-50'} p-3 flex justify-between items-center`}>
        <h3 className="font-bold">{title}</h3>
        {isActive && <span className="text-xs font-medium px-2 py-1 bg-blue-600 rounded-full">Now Serving</span>}
      </div>
      
      <div className="p-4">
        <div className="border-b pb-2 mb-2">
          <div className="flex flex-wrap gap-1">
            {items.filter((item, idx) => idx < 3).map((item, index) => (
              <span key={index} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {item}
              </span>
            ))}
            {items.length > 3 && (
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                +{items.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Today's Mess Menu</h2>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          onClick={() => setShowFullMenu(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <span>Weekly Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMealSection('Breakfast', todayMenu.breakfast, currentMeal === 'breakfast')}
        {renderMealSection('Lunch', todayMenu.lunch, currentMeal === 'lunch')}
        {renderMealSection('Hi-Tea', todayMenu.hiTea, currentMeal === 'hiTea')}
        {renderMealSection('Dinner', todayMenu.dinner, currentMeal === 'dinner')}
      </div>

      <FullMenuModal 
        isOpen={showFullMenu}
        onClose={() => setShowFullMenu(false)}
        menuData={messMenu}
      />
    </div>
  );
}

export default MessMenu;
