import CanteenItem from '../models/CanteenItem.js';
import CanteenOrder from '../models/CanteenOrder.js';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js'; // Add this import
import User from '../models/User.js'; // Added import for User model
import CanteenStatus from '../models/CanteenStatus.js'; // Added import for CanteenStatus model
import axios from 'axios';
import crypto from 'crypto'; // For signature verification
import Razorpay from 'razorpay'; // For Razorpay integration

// Initialize Razorpay with test API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_pQdLscjycgjJj3',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'ZAh3CfCQOiDpfEhqSmpvqkap'
});

// Item Management
export const createItem = async (req, res) => {
  try {
    const { name, description, price, category, preparationTime } = req.body;
    
    // Handle image upload if present
    let imageUrl = '';
    if (req.file) {
      try {
        const imageData = req.file.buffer.toString('base64');
        const response = await axios.post('https://api.imgbb.com/1/upload', {
          key: process.env.IMGBB_API_KEY,
          image: imageData,
        }, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = response.data.data.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without image if upload fails
      }
    }

    const canteenItem = new CanteenItem({
      name,
      description,
      price,
      imageUrl,
      category,
      preparationTime: preparationTime || 15
    });

    await canteenItem.save();
    res.status(201).json(canteenItem);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const { category, availability } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (availability) {
      query.availability = availability === 'true';
    }

    const items = await CanteenItem.find(query).sort({ category: 1, name: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Handle image upload if present
    if (req.file) {
      try {
        const imageData = req.file.buffer.toString('base64');
        const response = await axios.post('https://api.imgbb.com/1/upload', {
          key: process.env.IMGBB_API_KEY,
          image: imageData,
        }, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        updates.imageUrl = response.data.data.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    const item = await CanteenItem.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CanteenItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await CanteenItem.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Toggle the availability status
    item.availability = !item.availability;
    
    await item.save();
    
    res.status(200).json({
      message: `Item ${item.availability ? 'enabled' : 'disabled'} successfully`,
      item
    });
  } catch (error) {
    console.error('Error toggling item availability:', error);
    res.status(500).json({ message: 'Failed to toggle item availability' });
  }
};

// Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const items = await CanteenItem.find({ availability: true });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new menu item
export const addMenuItem = async (req, res) => {
  try {
    const { name, price, category, preparationTime, availability } = req.body;
    
    let imageUrl = '';
    
    // Handle image upload to IMGBB if image is provided
    if (req.file) {
      try {
        const imageData = req.file.buffer.toString('base64');
        const response = await axios.post('https://api.imgbb.com/1/upload', {
          key: process.env.IMGBB_API_KEY,
          image: imageData,
        }, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = response.data.data.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without image if upload fails
      }
    }

    const item = new CanteenItem({
      name,
      price: parseFloat(price),
      category,
      preparationTime: parseInt(preparationTime, 10),
      availability: availability === 'true',
      imageUrl
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const item = await CanteenItem.findByIdAndUpdate(id, updates, { new: true });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await CanteenItem.findByIdAndDelete(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Order Management
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    console.log('Creating temporary order for user:', req.user.email);
    console.log('Order items:', items);
    
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate total and create order items - just for Razorpay, not stored in DB yet
    let totalAmount = 0;
    const orderItems = [];
    
    for (const orderItem of items) {
      const item = await CanteenItem.findById(orderItem.itemId);
      if (!item) {
        return res.status(404).json({ message: `Item with ID ${orderItem.itemId} not found` });
      }
      if (!item.availability) {
        return res.status(400).json({ message: `Item "${item.name}" is not available` });
      }
      
      const itemPrice = item.price;
      const quantity = parseInt(orderItem.quantity, 10);
      
      orderItems.push({
        item: item._id,
        itemDetails: {  // Store full item details for reference
          id: item._id,
          name: item.name,
          price: item.price
        },
        quantity,
        price: itemPrice
      });
      
      totalAmount += itemPrice * quantity;
    }
    
    // Generate token number
    const lastOrder = await CanteenOrder.findOne().sort('-tokenNumber');
    const tokenNumber = lastOrder ? lastOrder.tokenNumber + 1 : 1001;
    
    // Set expiry to 2 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    
    // Create Razorpay order only (don't create MongoDB order yet)
    try {
      const amountInPaise = Math.round(totalAmount * 100);
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `tmp_${Date.now()}`,
        notes: {
          studentEmail: student.email,
          studentId: student._id.toString(),
          items: JSON.stringify(orderItems),  // Store order items in Razorpay notes
          tokenNumber: tokenNumber.toString()
        }
      });
      
      console.log('Razorpay order created with ID:', razorpayOrder.id);
      
      // Return the payment information without creating a DB order
      res.status(201).json({
        message: 'Temporary order created. Complete payment to place order.',
        orderData: {
          studentId: student._id,
          tokenNumber,
          totalAmount,
          items: orderItems,  // Include full details of order items
          expiresAt
        },
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: amountInPaise,
          currency: razorpayOrder.currency
        },
        razorpayKeyId: razorpay.key_id
      });
    } catch (razorpayError) {
      console.error('Razorpay order creation error:', razorpayError);
      return res.status(500).json({
        message: 'Failed to create Razorpay order',
        error: razorpayError.message
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Failed to create order',
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    console.log('Payment verification request received:', req.body);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData } = req.body;
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ 
        message: 'Missing required payment parameters',
        received: req.body,
        verified: false 
      });
    }
    
    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'ZAh3CfCQOiDpfEhqSmpvqkap')
      .update(text)
      .digest('hex');
    
    const isValid = generatedSignature === razorpay_signature;
    
    if (!isValid) {
      return res.status(400).json({ 
        message: 'Invalid payment signature',
        verified: false 
      });
    }
    
    // Get Razorpay order to extract notes
    const razorpayOrderData = await razorpay.orders.fetch(razorpay_order_id);
    console.log('Retrieved Razorpay order data:', razorpayOrderData);
    
    // Find the student
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Create a token number
    const lastOrder = await CanteenOrder.findOne().sort('-tokenNumber');
    const tokenNumber = lastOrder ? lastOrder.tokenNumber + 1 : 1001;
    
    // Generate expiry time (2 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    
    // Extract order items from Razorpay notes or from the request body
    let orderItems = [];
    let totalAmount = razorpayOrderData.amount / 100; // Convert from paisa to rupees
    
    // First try to get items from orderData sent from frontend
    if (orderData && orderData.items && Array.isArray(orderData.items)) {
      console.log('Using order items from request body:', orderData.items);
      orderItems = orderData.items.map(item => ({
        item: item.item,
        quantity: item.quantity,
        price: item.price
      }));
    } 
    // Then try from Razorpay notes if frontend data is not available
    else if (razorpayOrderData.notes && razorpayOrderData.notes.items) {
      try {
        console.log('Using order items from Razorpay notes');
        const parsedItems = JSON.parse(razorpayOrderData.notes.items);
        orderItems = parsedItems.map(item => ({
          item: item.item || item.itemId,
          quantity: item.quantity,
          price: item.price
        }));
      } catch (err) {
        console.error('Error parsing items from Razorpay notes:', err);
        // Continue with empty items if parsing fails
      }
    }
    
    // Create the order in MongoDB with items
    const order = new CanteenOrder({
      student: student._id,
      items: orderItems,  // Store the actual order items
      totalAmount,
      tokenNumber,
      expiresAt,
      paymentStatus: 'paid',
      orderStatus: 'pending',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date()
    });
    
    await order.save();
    console.log('Order created in database after payment:', order._id);
    
    res.status(200).json({
      message: 'Payment verified and order created successfully',
      order: {
        _id: order._id,
        tokenNumber: order.tokenNumber,
        totalAmount: order.totalAmount,
        expiresAt: order.expiresAt,
        items: orderItems // Return items in response
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: 'Failed to verify payment and create order',
      error: error.message
    });
  }
};

// Helper function to generate UPI deep links for different apps
function generateUPIDeepLinks(paymentInfo) {
  const { upiId, payeeName, amount, transactionRef, transactionNote } = paymentInfo;
  
  // Encode data for URL
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(transactionNote);
  
  // Base UPI URL
  const baseUpiUrl = `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&tn=${transactionRef}&cu=INR`;
  
  return {
    // General UPI URL for any app
    upiUrl: baseUpiUrl,
    
    // App-specific deep links
    googlePay: `gpay://upi/pay?pa=${upiId}&pn=${encodedName}&am=${amount}&tn=${transactionRef}&cu=INR&url=https://gpay.app.goo.gl/`,
    phonePe: `phonepe://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&tn=${transactionRef}&cu=INR`,
    paytm: `paytmmp://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&tn=${transactionRef}&cu=INR`,
    bhim: `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&tn=${transactionRef}&cu=INR&mc=0000&mode=02&purpose=00`,
  };
}

export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    
    const orders = await CanteenOrder.find(query)
      .sort({ createdAt: -1 })
      .populate('student', 'name email')
      .populate('items.item', 'name price');
      
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get student's orders
export const getStudentOrders = async (req, res) => {
  try {
    console.log('Getting orders for student:', req.user.email);
    
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Found student ID:', student._id);
    
    const orders = await CanteenOrder.find({ student: student._id })
      .sort({ createdAt: -1 })
      .populate('items.item')
      .lean();
    
    console.log(`Found ${orders.length} orders for student`);
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching student orders:', error);
    res.status(500).json({ message: 'Failed to fetch your orders' });
  }
};

// Mark order as completed
export const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await CanteenOrder.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order is already expired
    if (new Date() > new Date(order.expiresAt)) {
      return res.status(400).json({ message: 'This order has expired' });
    }
    
    order.orderStatus = 'completed';
    await order.save();
    
    res.status(200).json({ 
      message: 'Order marked as completed',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const order = await CanteenOrder.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    ).populate('student', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Overall stats
    const overallStats = await CanteenOrder.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    // Today's stats
    const todayStats = await CanteenOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    // Status counts
    const statusCounts = await CanteenOrder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Popular items
    const popularItems = await CanteenOrder.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.item',
          totalOrdered: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'canteenitems',
          localField: '_id',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      { $unwind: '$itemDetails' },
      {
        $project: {
          _id: 1,
          name: '$itemDetails.name',
          totalOrdered: 1,
          totalRevenue: 1
        }
      }
    ]);
    
    res.status(200).json({
      overall: overallStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
      today: todayStats[0] || { totalOrders: 0, totalRevenue: 0 },
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      popularItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCanteenStats = async (req, res) => {
  try {
    // Get counts from various collections
    const [
      totalMenuItems,
      todayOrders,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      CanteenItem.countDocuments(),
      CanteenOrder.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      CanteenOrder.countDocuments(),
      CanteenOrder.aggregate([
        {
          $match: { paymentStatus: 'paid' }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ])
    ]);

    // Get orders by status
    const orderStatusCounts = await CanteenOrder.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the status counts into a more usable object
    const ordersByStatus = orderStatusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {
      pending: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0
    });

    // Get recent orders
    const recentOrders = await CanteenOrder.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student', 'name')
      .select('tokenNumber totalAmount paymentStatus orderStatus createdAt');

    res.status(200).json({
      menuItems: {
        total: totalMenuItems
      },
      orders: {
        today: todayOrders,
        total: totalOrders,
        byStatus: ordersByStatus
      },
      revenue: {
        total: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching canteen stats:', error);
    res.status(500).json({ message: 'Failed to fetch canteen statistics' });
  }
};

export const getCanteenStatus = async (req, res) => {
  try {
    // Find the status document or create a default one if none exists
    let status = await CanteenStatus.findOne();
    
    if (!status) {
      status = await CanteenStatus.create({
        isOpen: false,
        message: "Night Canteen is currently closed."
      });
    }
    
    res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching canteen status:', error);
    res.status(500).json({ message: 'Failed to fetch canteen status' });
  }
};

export const updateCanteenStatus = async (req, res) => {
  try {
    const { isOpen, message } = req.body;
    
    // Find the status document or create it if it doesn't exist
    let status = await CanteenStatus.findOne();
    
    if (!status) {
      status = new CanteenStatus();
    }
    
    // Update the fields
    status.isOpen = isOpen;
    status.lastUpdated = new Date();
    
    if (message) {
      status.message = message;
    } else {
      status.message = isOpen 
        ? "Night Canteen is open and accepting orders." 
        : "Night Canteen is currently closed.";
    }
    
    await status.save();
    
    res.status(200).json(status);
  } catch (error) {
    console.error('Error updating canteen status:', error);
    res.status(500).json({ message: 'Failed to update canteen status' });
  }
};
