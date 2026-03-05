import { prisma } from "../config/db.js";

export const createOrder = async ({ customerId, totalPrice }) => {
  // Verify customer exists
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) {
    return { status: 404, message: "Customer not found" };
  }

  const order = await prisma.orders.create({
    data: {
      customerId,
      totalPrice,
    },
  });

  return { status: 201, message: "order created successfully", data: order };
};

export const updateOrder = async ({ orderId, customerId, totalPrice }) => {
  const current = await prisma.orders.findUnique({ where: { orderId } });
  if (!current) {
    return { status: 404, message: "Order not found" };
  }

  const data = {};
  if (typeof customerId === "number" && !Number.isNaN(customerId)) data.customerId = customerId;
  if (typeof totalPrice === "number" && !Number.isNaN(totalPrice)) data.totalPrice = totalPrice;

  if (Object.keys(data).length === 0) {
    return { status: 400, message: "No valid fields provided for update" };
  }

  const order = await prisma.orders.update({ where: { orderId }, data });
  return { status: 200, message: "order updated successfully", data: order };
};

export const deleteOrder = async ({ orderId }) => {
  const current = await prisma.orders.findUnique({ where: { orderId } });
  if (!current) {
    return { status: 404, message: "Order not found" };
  }

  // Clean up related order items first to avoid FK violations
  await prisma.orderItems.deleteMany({ where: { orderId } });

  const order = await prisma.orders.delete({ where: { orderId } });
  return { status: 200, message: "order deleted successfully", data: order };
};

export const getOrders = async () => {
  const orders = await prisma.orders.findMany({
    orderBy: { createAt: "desc" },
    include: {
      customer: true,
      ordersItems: {
        include: {
          product: true,
          customer: true,
        },
      },
    },
  });
  return { status: 200, message: "orders fetched successfully", data: orders };
};

export const getOrderById = async ({ orderId }) => {
  const order = await prisma.orders.findUnique({
    where: { orderId },
    include: {
      customer: true,
      ordersItems: {
        include: {
          product: true,
          customer: true,
        },
      },
    },
  });
  if (!order) {
    return { status: 404, message: "Order not found" };
  }
  return { status: 200, message: "order fetched successfully", data: order };
};