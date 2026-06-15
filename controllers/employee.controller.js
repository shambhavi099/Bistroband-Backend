const db = require("../config/firebase");
const bcrypt = require("bcryptjs");

const createEmployee = async (req, res) => {
  try {
    const {
      name,
      age,
      email,
      password,
      role,
      shift,
      phone,
      address,
      aadhaar,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const employeeData = {
      name,
      age,
      email,
      password: hashedPassword,
      role,
      shift,
      phone,
      address,
      aadhaar,
      createdAt: new Date(),
    };

    const docRef = await db
      .collection("employees")
      .add(employeeData);

    res.status(201).json({
      success: true,
      employeeId: docRef.id,
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      data: employeeData
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();

    const employees = snapshot.docs.map((doc) => {
      const data = doc.data();

      delete data.password;

      return {
        id: doc.id,
        ...data,
      };
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employeeDoc = await db
      .collection("employees")
      .doc(id)
      .get();

    if (!employeeDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employeeData = employeeDoc.data();

    delete employeeData.password;

    res.status(200).json({
      success: true,
      data: {
        id: employeeDoc.id,
        ...employeeData,
      },
    });
  } catch (error) {
    console.error("Get Employee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employeeRef = db
      .collection("employees")
      .doc(id);

    const employeeDoc = await employeeRef.get();

    if (!employeeDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const updateData = { ...req.body };

    delete updateData.password;

    await employeeRef.update(updateData);

    const updatedDoc = await employeeRef.get();

    const employeeData = updatedDoc.data();

    delete employeeData.password;

    res.status(200).json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...employeeData,
      },
    });
  } catch (error) {
    console.error("Update Employee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employeeRef = db
      .collection("employees")
      .doc(id);

    const employeeDoc = await employeeRef.get();

    if (!employeeDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employeeRef.delete();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const employeeDoc = await db
      .collection("employees")
      .doc(req.user.id)
      .get();

    if (!employeeDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employee = employeeDoc.data();

    delete employee.password;

    res.status(200).json({
      success: true,
      data: {
        id: employeeDoc.id,
        ...employee,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getProfile
};