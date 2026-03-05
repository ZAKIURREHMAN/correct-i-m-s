import {
  createOrder as createOrderHandler,
  updateOrder as updateOrderHandler,
  deleteOrder as deleteOrderHandler,
  getOrders as getOrdersHandler,
  getOrderById as getOrderByIdHandler,
} from "./OrderHandler.js";

export const createOrder = async (req, res) => {
  try {
    const { customerId, totalPrice } = req.body || {};
    const cid = parseInt(customerId, 10);
    const tp = parseInt(totalPrice, 10);
    if (!cid || Number.isNaN(cid) || !tp || Number.isNaN(tp)) {
      return res.status(400).json({ message: "valid customerId and totalPrice are required" });
    }
    const result = await createOrderHandler({ customerId: cid, totalPrice: tp });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
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