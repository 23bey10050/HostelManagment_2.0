import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

function StudentCanteen() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders'
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orders, setOrders] = useState([]);
  const [canteenStatus, setCanteenStatus] = useState({
    isOpen: false,
    message: "Night Canteen is currently closed."
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCanteenStatus();
    if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        'http://localhost:8000/api/canteen/items',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu items');
    } finally {
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
    } catch (err) {
      console.error('Error fetching canteen status:', err);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        'http://localhost:8000/api/canteen/my-orders',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("Student Orders:", response.data);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem.quantity === 1) {
      setCart(cart.filter(cartItem => cartItem._id !== item._id));
    } else {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? { ...cartItem, quantity: cartItem.quantity - 1 } 
          : cartItem
      ));
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      
      // Format items for the API
      const items = cart.map(item => ({
        itemId: item._id,
        quantity: item.quantity
      }));
      
      // Create temporary order
      const response = await axios.post(
        'http://localhost:8000/api/canteen/orders',
        { items },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Get order details from response
      const orderData = response.data;
      console.log('Temporary order created:', orderData);
      
      // Store detailed items information
      const detailedItems = orderData.orderData.items.map(item => ({
        item: item.item,
        quantity: item.quantity,
        price: item.price
      }));
      
      // Initialize Razorpay
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "Night Canteen",
        description: `Order #${orderData.orderData.tokenNumber}`,
        order_id: orderData.razorpayOrder.id,
        handler: function(response) {
          handlePaymentSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            {
              ...orderData.orderData,
              items: detailedItems // Include detailed items
            }
          );
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#3399cc"
        }
      };
      
      // Open Razorpay payment form
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(response) {
        setError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId, razorpayOrderId, signature, orderData) => {
    try {
      const token = await auth.currentUser.getIdToken();
      
      console.log('Payment success data:', {
        paymentId,
        razorpayOrderId,
        signature,
        orderData
      });
      
      // Verify payment with backend
      const response = await axios.post(
        `http://localhost:8000/api/canteen/orders/verify-payment`,
        {
          razorpay_payment_id: paymentId,
          razorpay_order_id: razorpayOrderId, 
          razorpay_signature: signature,
          orderData: orderData // Send the full order data including items
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Show success message
      setOrderSuccess(response.data);
      // Clear cart
      setCart([]);
      // Switch to orders tab
      setActiveTab('orders');
      // Refresh orders
      fetchMyOrders();
    } catch (err) {
      console.error('Error verifying payment:', err);
      setError(err.response?.data?.message || 'Failed to verify payment');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const isExpired = (expiryDate) => {
    return new Date() > new Date(expiryDate);
  };

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Night Canteen</h1>
      
      {/* Canteen Status Banner */}
      <div className={`mb-6 p-4 rounded-lg ${
        canteenStatus.isOpen ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
      }`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${canteenStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className="font-medium">{canteenStatus.message}</p>
        </div>
      </div>
      
      {orderSuccess && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{orderSuccess.message}</span>
          <div className="mt-2 font-bold">Token #{orderSuccess.order.tokenNumber}</div>
          <div className="mt-1 text-sm">
            Expires at: {formatDate(orderSuccess.order.expiresAt)}
          </div>
          <button 
            className="absolute top-0 right-0 mt-3 mr-4"
            onClick={() => setOrderSuccess(null)}
          >
            <span className="text-green-700">&times;</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`inline-block p-4 border-b-2 font-medium text-sm ${
              activeTab === 'menu' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('menu')}
          >
            Menu
          </button>
          <button
            className={`inline-block p-4 border-b-2 font-medium text-sm ${
              activeTab === 'orders' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {/* Conditionally render based on canteen status */}
            {!canteenStatus.isOpen ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-xl font-semibold text-red-600 mb-4">
                  Sorry, the Night Canteen is currently closed
                </h3>
                <p className="text-gray-600">
                  Please check back later when the canteen is open to place an order.
                </p>
              </div>
            ) : (
              Object.keys(groupedItems).length > 0 ? (
                Object.keys(groupedItems).map(category => (
                  <div key={category} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedItems[category].map(item => (
                        <div 
                          key={item._id} 
                          className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                        >
                          {item.imageUrl && (
                            <div className="h-40 overflow-hidden">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex justify-between mt-2">
                              <p className="text-gray-700">₹{item.price}</p>
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No menu items available</p>
              )
            )}
          </div>

          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow border p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Your Order</h2>
              
              {/* Disable cart functionality when canteen is closed */}
              {!canteenStatus.isOpen ? (
                <p className="text-gray-500 text-center py-6">
                  The Night Canteen is currently closed. Orders cannot be placed at this time.
                </p>
              ) : cart.length === 0 ? (
                <p className="text-gray-500 text-center py-6">Your cart is empty</p>
              ) : (
                <>
                  <ul className="space-y-4 mb-4">
                    {cart.map(item => (
                      <li key={item._id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <div className="text-sm text-gray-500">₹{item.price} each</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveFromCart(item)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !canteenStatus.isOpen}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div 
                  key={order._id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                    isExpired(order.expiresAt) ? 'border-gray-200' : 'border-green-400'
                  }`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="font-bold text-lg">Order Token: #{order.tokenNumber}</span>
                          {!isExpired(order.expiresAt) && (
                            <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                          )}
                          {order.orderStatus === 'completed' && (
                            <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Completed</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Ordered on: {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isExpired(order.expiresAt) 
                            ? `Expired at: ${formatDate(order.expiresAt)}` 
                            : `Expires at: ${formatDate(order.expiresAt)}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{order.totalAmount}</p>
                        <p className="text-sm text-gray-600">
                          Status: {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-semibold mb-2">Order Items:</h4>
                      {order.items && order.items.length > 0 ? (
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>
                                {item.item && typeof item.item === 'object' 
                                  ? item.item.name 
                                  : 'Item #' + index} × {item.quantity}
                              </span>
                              <span className="text-gray-600">
                                ₹{item.price * item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No items found in this order.</p>
                      )}
                    </div>
                    
                    {!isExpired(order.expiresAt) && order.orderStatus !== 'completed' && (
                      <div className="mt-4 pt-4 border-t text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Please pick up your order at the night canteen counter.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentCanteen;
