import {
  createOrder as createOrderHandler,
  updateOrder as updateOrderHandler,
  deleteOrder as deleteOrderHandler,
  getOrders as getOrdersHandler,
  getOrderById as getOrderByIdHandler,
} from "./OrderHandler.js";

export const createOrder = async (req, res) => {
  try {
    const { customerId, totalPrice, paidAmount = 0, items = [] } = req.body || {};
    
    // Input validation
    if (!customerId || !totalPrice) {
      return res.status(400).json({ 
        status: 400, 
        message: "Missing required fields: customerId and totalPrice are required" 
      });
    }

    // Parse and validate numeric values
    const cid = parseInt(customerId, 10);
    const tp = parseInt(totalPrice, 10);
    const pa = parseInt(paidAmount, 10) || 0;

    if (Number.isNaN(cid) || cid <= 0) {
      return res.status(400).json({ 
        status: 400, 
        message: "Invalid customerId: must be a positive integer" 
      });
    }

    if (Number.isNaN(tp) || tp < 0) {
      return res.status(400).json({ 
        status: 400, 
        message: "Invalid totalPrice: must be a non-negative integer" 
      });
    }

    if (Number.isNaN(pa) || pa < 0) {
      return res.status(400).json({ 
        status: 400, 
        message: "Invalid paidAmount: must be a non-negative integer" 
      });
    }

    if (pa > tp) {
      return res.status(400).json({ 
        status: 400, 
        message: "Paid amount cannot exceed total price" 
      });
    }

    // Create the order
    const result = await createOrderHandler({ 
      customerId: cid, 
      totalPrice: tp, 
      paidAmount: pa 
    });
    
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ 
      status: 500, 
      message: "Internal server error: Failed to create order" 
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const idParam = req.params.id;
    const orderId = parseInt(idParam, 10);
    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ message: "valid orderId is required" });
    }

    const { customerId, totalPrice } = req.body || {};
    const cid = customerId !== undefined ? parseInt(customerId, 10) : undefined;
    const tp = totalPrice !== undefined ? parseInt(totalPrice, 10) : undefined;

    const result = await updateOrderHandler({ orderId, customerId: cid, totalPrice: tp });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const idParam = req.params.id;
    const orderId = parseInt(idParam, 10);
    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ message: "valid orderId is required" });
    }
    const result = await deleteOrderHandler({ orderId });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (_req, res) => {
  try {
    const result = await getOrdersHandler();
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const idParam = req.params.id;
    const orderId = parseInt(idParam, 10);
    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ message: "valid orderId is required" });
    }
    const result = await getOrderByIdHandler({ orderId });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};