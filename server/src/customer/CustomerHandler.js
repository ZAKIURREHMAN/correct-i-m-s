import { prisma } from "../config/db.js";

export const createCustomer = async ({ name, email, number, address }) => {
  // Only enforce uniqueness when a non-empty email is provided
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  if (cleanEmail) {
    const exists = await prisma.customer.findFirst({ where: { email: cleanEmail } });
    if (exists) {
      return { status: 409, message: "Customer with this email already exists" };
    }
  }

  const customer = await prisma.customer.create({
    data: { name, email: cleanEmail, number, address },
  });

  return { status: 201, message: "customer created successfully", data: customer };
};

export const updateCustomer = async ({ customerId, name, email, number, address }) => {
  const current = await prisma.customer.findUnique({ where: { customerId } });
  if (!current) {
    return { status: 404, message: "Customer not found" };
  }

  const cleanEmail = typeof email === "string" ? email.trim() : current.email;

  const customer = await prisma.customer.update({
    where: { customerId },
    data: { name, email: cleanEmail, number, address },
  });

  return { status: 200, message: "customer updated successfully", data: customer };
};

export const deleteCustomer = async ({ customerId }) => {
  const current = await prisma.customer.findUnique({ where: { customerId } });
  if (!current) {
    return { status: 404, message: "Customer not found" };
  }

  const customer = await prisma.customer.delete({ where: { customerId } });
  return { status: 200, message: "customer deleted successfully", data: customer };
};

export const getCustomers = async () => {
  const customers = await prisma.customer.findMany();
  return { status: 200, message: "customers fetched successfully", data: customers };
};

export const getCustomerById = async ({ customerId }) => {
  const customer = await prisma.customer.findUnique({ where: { customerId } });
  if (!customer) {
    return { status: 404, message: "Customer not found" };
  }
  return { status: 200, message: "customer fetched successfully", data: customer };
};