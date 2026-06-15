const db = require("../config/firebase");

// Create Table
const createTable = async (req, res) => {
  try {
    const {
      tableNumber,
      capacity,
    } = req.body;

    const tableData = {
      tableNumber,
      capacity,
      status: "AVAILABLE",
      currentOrderId: null,
      createdAt: new Date(),
    };

    const docRef = await db
      .collection("tables")
      .add(tableData);

    res.status(201).json({
      success: true,
      tableId: docRef.id,
      data: tableData,
    });
  } catch (error) {
    console.error("Create Table Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tables
const getAllTables = async (req, res) => {
  try {
    const snapshot = await db
      .collection("tables")
      .get();

    const tables = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    console.error("Get Tables Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Table
const getTableById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db
      .collection("tables")
      .doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    console.error("Get Table Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Table Status
const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const tableRef = db
      .collection("tables")
      .doc(id);

    const tableDoc = await tableRef.get();

    if (!tableDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await tableRef.update({
      status,
      updatedAt: new Date(),
    });

    const updatedDoc = await tableRef.get();

    res.status(200).json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error("Update Table Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Table
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const tableRef = db
      .collection("tables")
      .doc(id);

    const tableDoc = await tableRef.get();

    if (!tableDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await tableRef.delete();

    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error("Delete Table Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTable,
  getAllTables,
  getTableById,
  updateTableStatus,
  deleteTable,
};