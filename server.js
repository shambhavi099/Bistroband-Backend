 const express = require("express");
 require("dotenv").config();
 const cors = require("cors");

 const app = express();
 const db = require("./config/firebase")

const employeeRoutes = require("./routes/employee.routes")
const authRoutes = require("./routes/authRoutes")
const orders = require("./routes/ordersRoutes")
const tableRoutes = require("./routes/tableRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const menuRoutes = require("./routes/menuRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const customerRoutes = require("./routes/customerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportsRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

 app.use(express.json());

 app.get("/", (req, res) => {
   res.send("Yes")
 })

 app.use("/api/employees", employeeRoutes);
 app.use("/api/auth", authRoutes);
 app.use("/api/orders", orders);
 app.use("/api/tables", tableRoutes);
 app.use("/api/dashboard", dashboardRoutes);
 app.use("/api/menu", menuRoutes);
 app.use("/api/inventory", inventoryRoutes);
 app.use("/api/customers", customerRoutes);
 app.use("/api/payments", paymentRoutes);
 app.use("/api/reports", reportRoutes);
 app.use("/api/admin", adminRoutes);

 app.listen(5000, ()=>{
    console.log("server started")
 })