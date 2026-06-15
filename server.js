 const express = require("express");
 require("dotenv").config();

 const app = express();
 const db = require("./config/firebase")

const employeeRoutes = require("./routes/employee.routes")
const authRoutes = require("./routes/authRoutes")

 app.use(express.json());

 app.get("/", (req, res) => {
   res.send("Yes")
 })

 app.get("/test", async(req, res)=>{
   try{  
      await db.collection("test").add({
         message:"testing",
         createdAt:new Date(),
      })
      res.send("Hi")
   }catch(error){
      console.log(error.message)
   }
 })

 app.use("/api/employees", employeeRoutes)
 app.use("/api/auth", authRoutes)

 app.listen(5000, ()=>{
    console.log("server started")
 })