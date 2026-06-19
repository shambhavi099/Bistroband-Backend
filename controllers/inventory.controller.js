const db = require("../config/firebase");

// Create Inventory Item
const createInventoryItem = async (req, res) => {
  try {
    const {
      name,
      quantity,
      unit,
      minQuantity,
      category
    } = req.body;

    let status = "in-stock";

    if (quantity == 0) status = "out-of-stock";
    else if (quantity <= minQuantity) status = "low-stock";

    const inventoryItem = {
      name,
      quantity,
      unit,
      minQuantity,
      category,
      status,
      lastSupplied: new Date().toLocaleDateString(),
      createdAt: new Date()
    };

    const docRef = await db
      .collection("inventory")
      .add(inventoryItem);

    res.status(201).json({
      success: true,
      inventoryId: docRef.id,
      data: inventoryItem
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Inventory
const getAllInventory = async (req, res) => {
  try {

    const snapshot = await db
      .collection("inventory")
      .get();

    const inventory = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      success: true,
      data: inventory
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Increase / Decrease Stock
const updateStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { value } = req.body;

    const inventoryRef = db
      .collection("inventory")
      .doc(id);

    const doc = await inventoryRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    const item = doc.data();

    const quantity = Math.max(
      0,
      Number(item.quantity) + Number(value)
    );

    let status = "in-stock";

    if (quantity === 0)
      status = "out-of-stock";

    else if (quantity <= item.minQuantity)
      status = "low-stock";

    await inventoryRef.update({
      quantity,
      status
    });

    const updated = await inventoryRef.get();

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        ...updated.data()
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Restock Low Inventory
const restockLowStock = async (req, res) => {

  try {

    const snapshot = await db
      .collection("inventory")
      .get();

    const batch = db.batch();

    snapshot.forEach(doc => {

      const item = doc.data();

      if (item.quantity <= item.minQuantity) {

        batch.update(doc.ref, {

          quantity: item.minQuantity * 2 + 15,

          status: "in-stock",

          lastSupplied: new Date().toLocaleDateString()

        });

      }

    });

    await batch.commit();

    res.status(200).json({

      success: true,

      message: "Inventory Restocked"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const inventoryRef = db
      .collection("inventory")
      .doc(id);

    const inventoryDoc = await inventoryRef.get();

    if (!inventoryDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    await inventoryRef.delete();

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });

  } catch (error) {
    console.error("Delete Inventory Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInventoryItem,
  getAllInventory,
  updateStock,
  restockLowStock,
  deleteInventoryItem
};