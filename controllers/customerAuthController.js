const db = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==============================
// REGISTER CUSTOMER
// ==============================

const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const snapshot = await db
      .collection("customers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customerData = {
      name,
      email,
      phone,
      password: hashedPassword,
      loyaltyPoints: 0,
      tier: "Bronze",
      totalVisits: 0,
      totalSpent: 0,
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db
      .collection("customers")
      .add(customerData);

    delete customerData.password;

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: {
        id: docRef.id,
        ...customerData,
      },
    });

  } catch (error) {

    console.error("Customer Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// LOGIN CUSTOMER
// ==============================

const loginCustomer = async (req, res) => {
  try {
    const { email} = req.body;
    const snapshot = await db
      .collection("customers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const customerDoc = snapshot.docs[0];
    const customer = customerDoc.data();

    /*const isMatch = await bcrypt.compare(
      String(password),
      customer.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }**/

    const token = jwt.sign(
      {
        id: customerDoc.id,
        role: "Customer",
        email: customer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete customer.password;
    customer.role = "Customer";

    return res.status(200).json({
      success: true,
      token,
      data: {
        id: customerDoc.id,
        ...customer,
      },
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// GET CUSTOMER PROFILE
// ==============================

const getCustomerProfile = async (req, res) => {
  try {

    const customerDoc = await db
      .collection("customers")
      .doc(req.user.id)
      .get();

    if (!customerDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customer = customerDoc.data();

    delete customer.password;

    return res.status(200).json({
      success: true,
      data: {
        id: customerDoc.id,
        ...customer,
      },
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
};