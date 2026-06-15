const db = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db
      .collection("employees")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const employeeDoc = snapshot.docs[0];
    const employee = employeeDoc.data();

    const isMatch = await bcrypt.compare(
      String(password),
      employee.password
    );

    if (!isMatch) {
    return res.status(401).json({
        success: false,
        message: "Invalid email or password",
    });
    }

    const token = jwt.sign(
    {
        id: employeeDoc.id,
        role: employee.role,
        email: employee.email,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d",
    }
    );

    delete employee.password;

    res.status(200).json({
    success: true,
    token,
    data: {
        id: employeeDoc.id,
        ...employee,
    },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { login };