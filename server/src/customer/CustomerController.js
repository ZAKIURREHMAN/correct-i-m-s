import {
  createCustomer as createCustomerHandler,
  updateCustomer as updateCustomerHandler,
  deleteCustomer as deleteCustomerHandler,
  getCustomers as getCustomersHandler,
  getCustomerById as getCustomerByIdHandler,
} from "./CustomerHandler.js";

export const createCustomer = async (req, res) => {
  try {
    const { name, email, number, address } = req.body || {};
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    const result = await createCustomerHandler({ name, email, number, address });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const idParam = req.params.id;
    const customerId = parseInt(idParam, 10);
    if (!customerId || Number.isNaN(customerId)) {
      return res.status(400).json({ message: "valid customerId is required" });
    }
    const { name, email, number, address } = req.body || {};
    const result = await updateCustomerHandler({ customerId, name, email, number, address });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const idParam = req.params.id;
    const customerId = parseInt(idParam, 10);
    if (!customerId || Number.isNaN(customerId)) {
      return res.status(400).json({ message: "valid customerId is required" });
    }
    const result = await deleteCustomerHandler({ customerId });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomers = async (_req, res) => {
  try {
    const result = await getCustomersHandler();
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const idParam = req.params.id;
    const customerId = parseInt(idParam, 10);
    if (!customerId || Number.isNaN(customerId)) {
      return res.status(400).json({ message: "valid customerId is required" });
    }
    const result = await getCustomerByIdHandler({ customerId });
    return res.status(result.status).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};