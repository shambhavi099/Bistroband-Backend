const db = require("../config/firebase");

// CREATE MENU ITEM
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      isAvailable,
      preparationTime,
      isPopular,
    } = req.body;

    const menuItem = {
      name,
      description,
      price,
      category,
      isAvailable,
      preparationTime,
      isPopular,
      createdAt: new Date(),
    };

    const docRef = await db.collection("menuItems").add(menuItem);

    res.status(201).json({
      success: true,
      menuItemId: docRef.id,
      data: menuItem,
    });
  } catch (error) {
    console.error("Create Menu Item Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL MENU ITEMS
const getAllMenuItems = async (req, res) => {
  try {
    const snapshot = await db.collection("menuItems").get();

    const menu = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      count: menu.length,
      data: menu,
    });
  } catch (error) {
    console.error("Get Menu Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MENU ITEM BY ID
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const menuDoc = await db.collection("menuItems").doc(id).get();

    if (!menuDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: menuDoc.id,
        ...menuDoc.data(),
      },
    });
  } catch (error) {
    console.error("Get Menu Item Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuRef = db.collection("menuItems").doc(id);

    const menuDoc = await menuRef.get();

    if (!menuDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await menuRef.update({
      ...req.body,
      updatedAt: new Date(),
    });

    const updatedDoc = await menuRef.get();

    res.status(200).json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error("Update Menu Item Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuRef = db.collection("menuItems").doc(id);

    const menuDoc = await menuRef.get();

    if (!menuDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await menuRef.delete();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete Menu Item Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE AVAILABILITY
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const menuRef = db.collection("menuItems").doc(id);

    const menuDoc = await menuRef.get();

    if (!menuDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await menuRef.update({
      isAvailable,
      updatedAt: new Date(),
    });

    const updatedDoc = await menuRef.get();

    res.status(200).json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error("Update Availability Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
};