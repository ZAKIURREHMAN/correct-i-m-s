import { prisma } from "../config/db.js";

export const createOrder = async ({ customerId, totalPrice, paidAmount = 0 }) => {
  // Verify customer exists
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) {
    return { status: 404, message: "Customer not found" };
  }

  // Validate payment amount
  if (paidAmount < 0) {
    return { status: 400, message: "Paid amount cannot be negative" };
  }
  
  if (paidAmount > totalPrice) {
    return { status: 400, message: "Paid amount cannot exceed total price" };
  }

  // Calculate pending amount
  const pendingAmount = totalPrice - paidAmount;
  const isPaid = pendingAmount === 0;

  // Check if customer already has an existing order
  const existingOrder = await prisma.orders.findFirst({
    where: { customerId },
    orderBy: { createAt: 'desc' }
  });

  // If customer has existing order, update it instead of creating new one
  if (existingOrder) {
    const updatedOrder = await prisma.orders.update({
      where: { orderId: existingOrder.orderId },
      data: {
        totalPrice: existingOrder.totalPrice + totalPrice,
        paidAmount: existingOrder.paidAmount + paidAmount,
        pendingAmount: existingOrder.pendingAmount + pendingAmount,
        isPaid: existingOrder.isPaid && isPaid,
        updateAt: new Date()
      },
    });

    return { 
      status: 200, 
      message: "order updated successfully (added to existing order)", 
      data: updatedOrder,
      existingOrder: true
    };
  }

  // Create new order for new customer
  const order = await prisma.orders.create({
    data: {
      customerId,
      totalPrice,
      paidAmount,
      pendingAmount,
      isPaid,
    },
  });

  return { status: 201, message: "order created successfully", data: order, existingOrder: false };
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

export const searchOrders = async ({ query }) => {
  if (!query) {
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
  }

  // Try to parse as number for ID search
  const idQuery = parseInt(query);
  const isNumericId = !isNaN(idQuery);

  const orders = await prisma.orders.findMany({
    where: {
      OR: [
        // Search by order ID (only if query is numeric)
        ...(isNumericId ? [{ orderId: { equals: idQuery } }] : []),
        // Search by customer name (case insensitive)
        { customer: { name: { contains: query.toLowerCase() } } },
        // Search by customer number/contact (case insensitive)
        { customer: { number: { contains: query.toLowerCase() } } },
      ],
    },
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