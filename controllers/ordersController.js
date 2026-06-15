const db = require("../config/firebase");

const createOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      customerName,
      tableId,
      tableNumber,
      items,
      totalAmount,
      specialInstructions,
    } = req.body;

    const orderData = {
      orderNumber,
      customerName,
      tableId,
      tableNumber,
      items,
      totalAmount,
      specialInstructions: specialInstructions || "",
      status: "PREPARING",
      createdAt: new Date(),
    };

    const docRef = await db
      .collection("orders")
      .add(orderData);

    const tableRef = db.collection("tables").doc(tableId);

    const tableDoc = await tableRef.get();

    if (!tableDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await tableRef.update({
      status: "OCCUPIED",
      currentOrderId: docRef.id,
      updatedAt: new Date(),
    });  

    res.status(201).json({
      success: true,
      orderId: docRef.id,
      data: orderData,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const snapshot = await db
      .collection("orders")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const orderRef = db
      .collection("orders")
      .doc(id);

    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await orderRef.update({
    status,
    updatedAt: new Date(),
  });

  if (status === "COMPLETED") {
  const orderData = orderDoc.data();

  if (orderData.tableId) {
    await db
      .collection("tables")
      .doc(orderData.tableId)
      .update({
        status: "AVAILABLE",
        currentOrderId: null,
        updatedAt: new Date(),
      });
  }
}

    const updatedDoc = await orderRef.get();

    res.status(200).json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const orderRef = db.collection("orders").doc(id);

    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await orderRef.update({
      ...req.body,
      updatedAt: new Date(),
    });

    const updatedDoc = await orderRef.get();

    res.status(200).json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error("Update Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db
      .collection("orders")
      .doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
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
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const orderRef = db.collection("orders").doc(id);

    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await orderRef.delete();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
  getOrderById,
  deleteOrder
};