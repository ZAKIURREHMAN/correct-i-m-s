import express from "express";
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
  getOrderById,
} from "./OrderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router;