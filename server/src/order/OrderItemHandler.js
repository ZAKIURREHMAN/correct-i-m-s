import { prisma } from "../config/db.js";

export const createOrderItem = async ({ orderId, productId, customerId, customizePrise, quantity, subTotal }) => {
  // Use a transaction to keep stock update and item creation atomic
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.orders.findUnique({ where: { orderId } });
    if (!order) return { status: 404, message: "Order not found" };

    const product = await tx.products.findUnique({ where: { productId } });
    if (!product) return { status: 404, message: "Product not found" };

    const customer = await tx.customer.findUnique({ where: { customerId } });
    if (!customer) return { status: 404, message: "Customer not found" };

    const qty = parseInt(quantity, 10);
    if (!qty || Number.isNaN(qty) || qty <= 0) {
      return { status: 400, message: "Quantity must be a positive integer" };
    }

    if (product.quantity < qty) {
      return { status: 400, message: "Insufficient stock for this product" };
    }

    // Decrease stock atomically
    const updatedProduct = await tx.products.update({
      where: { productId },
      data: { quantity: { decrement: qty } },
    });

    // Create order item
    const orderItem = await tx.orderItems.create({
      data: { orderId, productId, customerId, customizePrise, quantity: qty, subTotal },
    });

    return { status: 201, message: "order item created successfully", data: orderItem, stock: { productId, newQuantity: updatedProduct.quantity } };
  });

  return result;
};

export const updateOrderItem = async ({ orderItemId, orderId, productId, customerId, customizePrise, quantity, subTotal }) => {
  const current = await prisma.orderItems.findUnique({ where: { orderItemId } });
  if (!current) return { status: 404, message: "Order item not found" };

  const data = {};
  if (typeof orderId === "number" && !Number.isNaN(orderId)) data.orderId = orderId;
  if (typeof productId === "number" && !Number.isNaN(productId)) data.productId = productId;
  if (typeof customerId === "number" && !Number.isNaN(customerId)) data.customerId = customerId;
  if (typeof quantity === "number" && !Number.isNaN(quantity)) data.quantity = quantity;
  if (typeof subTotal === "number" && !Number.isNaN(subTotal)) data.subTotal = subTotal;
  if (typeof customizePrise === "number" && !Number.isNaN(customizePrise)) data.customizePrise = customizePrise;

  if (Object.keys(data).length === 0) {
    return { status: 400, message: "No valid fields provided for update" };
  }

  const orderItem = await prisma.orderItems.update({ where: { orderItemId }, data });
  return { status: 200, message: "order item updated successfully", data: orderItem };
};

export const deleteOrderItem = async ({ orderItemId }) => {
  const current = await prisma.orderItems.findUnique({ where: { orderItemId } });
  if (!current) return { status: 404, message: "Order item not found" };

  const orderItem = await prisma.orderItems.delete({ where: { orderItemId } });
  return { status: 200, message: "order item deleted successfully", data: orderItem };
};

export const getOrderItems = async ({ orderId } = {}) => {
  const where = {};
  if (typeof orderId === "number" && !Number.isNaN(orderId)) where.orderId = orderId;
  const items = await prisma.orderItems.findMany({ where, include: { product: true, customer: true } });
  return { status: 200, message: "order items fetched successfully", data: items };
};

export const getOrderItemById = async ({ orderItemId }) => {
  const item = await prisma.orderItems.findUnique({
    where: { orderItemId },
    include: { order: true, product: true, customer: true },
  });
  if (!item) return { status: 404, message: "Order item not found" };
  return { status: 200, message: "order item fetched successfully", data: item };
};

export const returnOrderItem = async ({ orderItemId, returnQuantity }) => {
  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.orderItems.findUnique({ where: { orderItemId } });
    if (!item) return { status: 404, message: "Order item not found" };

    const product = await tx.products.findUnique({ where: { productId: item.productId } });
    if (!product) return { status: 404, message: "Product not found" };

    const qty = parseInt(returnQuantity, 10);
    if (!qty || Number.isNaN(qty) || qty <= 0) {
      return { status: 400, message: "Return quantity must be a positive integer" };
    }
    if (item.quantity < qty) {
      return { status: 400, message: "Return quantity exceeds purchased quantity" };
    }

    const updatedProduct = await tx.products.update({
      where: { productId: item.productId },
      data: { quantity: { increment: qty } },
    });

    const newItemQuantity = item.quantity - qty;
    const newSubTotal = newItemQuantity * item.customizePrise;

    const updatedItem = await tx.orderItems.update({
      where: { orderItemId },
      data: { quantity: newItemQuantity, subTotal: newSubTotal },
    });

    const refundAmount = qty * item.customizePrise;
    await tx.orders.update({
      where: { orderId: item.orderId },
      data: { totalPrice: { decrement: refundAmount } },
    });

    return { status: 200, message: "return processed successfully", data: updatedItem, stock: { productId: product.productId, newQuantity: updatedProduct.quantity }, refundAmount };
  });

  return result;
};