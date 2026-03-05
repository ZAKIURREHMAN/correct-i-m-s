// reload nodemon
import {
  createOrderItem as createOrderItemHandler,
  updateOrderItem as updateOrderItemHandler,
  deleteOrderItem as deleteOrderItemHandler,
  getOrderItems as getOrderItemsHandler,
  getOrderItemById as getOrderItemByIdHandler,
  returnOrderItem as returnOrderItemHandler,
} from "./OrderItemHandler.js";

export const createOrderItem = async (req, res) => {
  try {
    const { orderId, productId, customizePrise, customerId, quantity, subTotal } = req.body || {};
    const oid = parseInt(orderId, 10);
    const pid = parseInt(productId, 10);
    const cid = parseInt(customerId, 10);
    const qty = parseInt(quantity, 10);
    const cp = parseInt(customizePrise, 10);
    const st = parseInt(subTotal, 10);

    if (
      !oid || Number.isNaN(oid) ||
      !pid || Number.isNaN(pid) ||
      !cid || Number.isNaN(cid) ||
      !qty || Number.isNaN(qty) ||
      Number.isNaN(cp) || Number.isNaN(st)
    ) {
      return res.status(400).json({
        message:
          "valid orderId, productId, customerId, quantity and numeric customizePrise, subTotal are required",
      });
    }

    const result = await createOrderItemHandler({
      orderId: oid,
      productId: pid,
      customerId: cid,
      customizePrise: cp,
      quantity: qty,
      subTotal: st,
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("createOrderItem error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const idParam = req.params.id;
    const orderItemId = parseInt(idParam, 10);
    if (!orderItemId || Number.isNaN(orderItemId)) {
      return res.status(400).json({ message: "valid orderItemId is required" });
    }

    const { orderId, productId, customerId, quantity, subTotal, customizePrise } = req.body || {};
    const oid = orderId !== undefined ? parseInt(orderId, 10) : undefined;
    const pid = productId !== undefined ? parseInt(productId, 10) : undefined;
    const cid = customerId !== undefined ? parseInt(customerId, 10) : undefined;
    const qty = quantity !== undefined ? parseInt(quantity, 10) : undefined;
    const st = subTotal !== undefined ? parseInt(subTotal, 10) : undefined;
    const cp = customizePrise !== undefined ? parseInt(customizePrise, 10) : undefined;

    const result = await updateOrderItemHandler({
      orderItemId,
      orderId: oid,
      productId: pid,
      customerId: cid,
      customizePrise: cp,
      quantity: qty,
      subTotal: st,
    });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("updateOrderItem error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const idParam = req.params.id;
    const orderItemId = parseInt(idParam, 10);
    if (!orderItemId || Number.isNaN(orderItemId)) {
      return res.status(400).json({ message: "valid orderItemId is required" });
    }
    const result = await deleteOrderItemHandler({ orderItemId });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("deleteOrderItem error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderItems = async (req, res) => {
  try {
    const orderIdParam = req.query.orderId;
    const oid = orderIdParam !== undefined ? parseInt(orderIdParam, 10) : undefined;
    const result = await getOrderItemsHandler({ orderId: oid });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getOrderItems error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderItemById = async (req, res) => {
  try {
    const idParam = req.params.id;
    const orderItemId = parseInt(idParam, 10);
    if (!orderItemId || Number.isNaN(orderItemId)) {
      return res.status(400).json({ message: "valid orderItemId is required" });
    }
    const result = await getOrderItemByIdHandler({ orderItemId });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("getOrderItemById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const returnOrderItem = async (req, res) => {
  try {
    const { orderItemId, returnQuantity } = req.body || {};
    const id = parseInt(orderItemId, 10);
    const qty = parseInt(returnQuantity, 10);
    if (!id || Number.isNaN(id) || !qty || Number.isNaN(qty)) {
      return res.status(400).json({ message: "valid orderItemId and returnQuantity are required" });
    }
    const result = await returnOrderItemHandler({ orderItemId: id, returnQuantity: qty });
    return res.status(result.status).json(result);
  } catch (err) {
    console.error("returnOrderItem error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};