import express from "express";
import {
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getOrderItems,
  getOrderItemById,
  returnOrderItem,
} from "./OrderItemController.js";

const router = express.Router();

router.post("/create", createOrderItem);
router.post("/return", returnOrderItem);
router.put("/update/:id", updateOrderItem);
router.delete("/delete/:id", deleteOrderItem);
router.get("/", getOrderItems);
router.get("/:id", getOrderItemById);

export default router;