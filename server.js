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

 app.use("/api/employees", employeeRoutes)
 app.use("/api/auth", authRoutes)
 app.use("/api/orders", orders)
 app.use("/api/tables", tableRoutes);
 app.use("/api/dashboard", dashboardRoutes);
 app.use("/api/menu", menuRoutes)

 app.listen(5000, ()=>{
    console.log("server started")
 })