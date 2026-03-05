import express from "express";
import cors from "cors";
import authRoutes from "./src/auth/userRoutes.js";
import companyRoutes from "./src/company/companyRoutes.js";
import productRoutes from "./src/products/ProductRoutes.js";
import customerRoutes from "./src/customer/CustomerRoutes.js";
import orderRoutes from "./src/order/OrderRoutes.js";
import orderItemRoutes from "./src/order/OrderItemRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Welcome to the Inventory Management System API",
  });
});

app.use("/auth", authRoutes);
app.use("/company", companyRoutes);
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);
app.use("/order-items", orderItemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
