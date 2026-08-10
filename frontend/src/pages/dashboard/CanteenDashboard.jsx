import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

function CanteenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    menuItems: { total: 0 },
    orders: { 
      today: 0, 
      total: 0,
      byStatus: {
        pending: 0,
        preparing: 0,
        ready: 0,
        completed: 0,
        cancelled: 0
      }
    },
    revenue: { total: 0 },
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canteenStatus, setCanteenStatus] = useState({
    isOpen: false,
    message: "Night Canteen is currently closed."
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchCanteenData();
    fetchCanteenStatus();
  }, []);

  const fetchCanteenData = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get('http://localhost:8000/api/canteen/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching canteen data:', error);
      setError('Failed to load canteen statistics');
      setLoading(false);
    }
  };

  const fetchCanteenStatus = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get('http://localhost:8000/api/canteen/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanteenStatus(response.data);
      setStatusMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching canteen status:', error);
      setError('Failed to load canteen status');
    }
  };

  const toggleCanteenStatus = async () => {
    try {
      setUpdatingStatus(true);
      const token = await auth.currentUser.getIdToken();
      const newStatus = !canteenStatus.isOpen;
      
      const response = await axios.put(
        'http://localhost:8000/api/canteen/status',
        { 
          isOpen: newStatus,
          message: statusMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setCanteenStatus(response.data);
      setStatusMessage(response.data.message);
    } catch (error) {
      console.error('Error updating canteen status:', error);
      setError('Failed to update canteen status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Night Canteen Dashboard</h1>
      
      {/* Canteen Status Toggle Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Canteen Status</h2>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${canteenStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-gray-700">{canteenStatus.isOpen ? 'Open' : 'Closed'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-64">
              <input
                type="text"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Status message"
              />
            </div>
            
            <button
              onClick={toggleCanteenStatus}
              disabled={updatingStatus}
              className={`px-4 py-2 rounded-md text-white ${
                canteenStatus.isOpen 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } disabled:opacity-50`}
            >
              {updatingStatus 
                ? 'Updating...' 
                : canteenStatus.isOpen 
                  ? 'Close Canteen' 
                  : 'Open Canteen'
              }
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Last updated: {new Date(canteenStatus.lastUpdated).toLocaleString()}</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Menu Items</p>
              <h3 className="text-2xl font-bold mt-2">{stats.menuItems.total}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Today's Orders</p>
              <h3 className="text-2xl font-bold mt-2">{stats.orders.today}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold mt-2">{stats.orders.total}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2">₹{stats.revenue.total.toFixed(2)}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders by Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold">{stats.orders.byStatus.pending || 0}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-blue-500 text-sm">Preparing</p>
            <p className="text-2xl font-bold">{stats.orders.byStatus.preparing || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-yellow-500 text-sm">Ready</p>
            <p className="text-2xl font-bold">{stats.orders.byStatus.ready || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-green-500 text-sm">Completed</p>
            <p className="text-2xl font-bold">{stats.orders.byStatus.completed || 0}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-red-500 text-sm">Cancelled</p>
            <p className="text-2xl font-bold">{stats.orders.byStatus.cancelled || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        
        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.tokenNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.student?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent orders found</p>
        )}
      </div>
    </div>
  );
}

export default CanteenDashboard;
