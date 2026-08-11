import { useState, useEffect } from 'react';
import axios from 'axios';
import AddItemModal from '../../components/dashboard/canteen/AddItemModal';
import EditItemModal from '../../components/dashboard/canteen/EditItemModal';

function CanteenMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, [categoryFilter, availabilityFilter]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('demo_token');
      
      let url = 'http://localhost:8000/api/canteen/items';
      const params = new URLSearchParams();
      
      if (categoryFilter) {
        params.append('category', categoryFilter);
      }
      
      if (availabilityFilter) {
        params.append('availability', availabilityFilter);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('demo_token');
      await axios.delete(`http://localhost:8000/api/canteen/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh menu items
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleItemAvailability = async (itemId) => {
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.patch(
        `http://localhost:8000/api/canteen/items/${itemId}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update the local state with the toggled item
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, availability: !item.availability } : item
        )
      );
      
      // Optional - show success message
      console.log(response.data.message);
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const categories = ['Food', 'Beverage', 'Snack', 'Dessert', 'Other'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Canteen Menu Management</h1>
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Items</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <div key={item._id} className={`bg-white rounded-lg shadow overflow-hidden ${!item.availability ? 'opacity-60' : ''}`}>
            <div className="h-48 bg-gray-200 relative">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
              
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.availability 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                </div>
                <p className="text-lg font-bold">₹{item.price}</p>
              </div>
              
              {item.description && (
                <p className="text-gray-600 text-sm mt-2">{item.description}</p>
              )}
              
              <div className="flex justify-between mt-4">
                <p className="text-sm text-gray-500">Prep time: {item.preparationTime} mins</p>
              </div>
              
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => toggleItemAvailability(item._id)}
                  className={`px-3 py-1 rounded text-sm ${
                    item.availability 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {item.availability ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {menuItems.length === 0 && (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No menu items found. Add your first item to get started.
          </div>
        )}
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={fetchMenuItems}
      />
      
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onEdit={fetchMenuItems}
      />
    </div>
  );
}

export default CanteenMenu;
