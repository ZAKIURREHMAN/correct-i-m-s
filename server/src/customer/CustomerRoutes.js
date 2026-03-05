import express from "express";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById,
} from "./CustomerController.js";

const router = express.Router();

router.post("/create", createCustomer);
router.put("/update/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);

export default router;