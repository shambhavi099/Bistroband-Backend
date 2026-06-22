const db = require("../config/firebase");
const admin = require("firebase-admin");

// ===============================
// GET ALL PAYMENTS
// ===============================
const getPayments = async (req, res) => {
  try {
    const snapshot = await db
      .collection("payments")
      .orderBy("createdAt", "desc")
      .get();

    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(payments);
  } catch (error) {
    console.error("Get Payments Error:", error);
    return res.status(500).json({
      message: "Failed to fetch payments",
    });
  }
};

// ===============================
// GET SINGLE PAYMENT
// ===============================
const getPaymentById = async (req, res) => {
  try {
    const paymentDoc = await db
      .collection("payments")
      .doc(req.params.id)
      .get();

    if (!paymentDoc.exists) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      id: paymentDoc.id,
      ...paymentDoc.data(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to fetch payment",
    });
  }
};

// ===============================
// CREATE PAYMENT
// ===============================
const createPayment = async (req, res) => {
  try {
    const {
      orderId,
      tableNumber,
      customerId,
      customerName,
      subtotal,
      tip,
      discount,
      total,
      method,
    } = req.body;

    if (!total || total <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    // Transaction ID
    const paymentId =
      "TXN-" + Math.floor(100000 + Math.random() * 900000);

    const paymentData = {
      transactionId: paymentId,

      orderId: orderId || null,
      tableNumber: tableNumber || null,

      customerId: customerId || null,
      customerName: customerName || "Walk-In Guest",

      subtotal: Number(subtotal),
      tip: Number(tip),
      discount: Number(discount),
      total: Number(total),

      method,
      status: "Settled",

      timestamp: new Date().toLocaleString(),

      createdAt: new Date()
    };

    // Save Payment
    const paymentRef = await db
      .collection("payments")
      .add(paymentData);

    // -----------------------------
    // UPDATE ORDER
    // -----------------------------
    if (orderId) {
      const orderRef = db.collection("orders").doc(orderId);

      const orderSnap = await orderRef.get();

      if (orderSnap.exists) {
        await orderRef.update({
          status: "COMPLETED",
          paymentStatus: "Paid",
          updatedAt:
            new Date()
        });
      }
    }

    // -----------------------------
    // UPDATE TABLE
    // -----------------------------
    if (tableNumber) {
      const tableSnapshot = await db
        .collection("tables")
        .where("tableNumber", "==", tableNumber)
        .limit(1)
        .get();

      if (!tableSnapshot.empty) {
        const tableDoc = tableSnapshot.docs[0];

        await tableDoc.ref.update({
          status: "available",
          spendAmount: 0,
          assignedStaffName: "",
          currentOrderId: "",
          updatedAt:
            new Date()
        });
      }
    }

    // -----------------------------
    // UPDATE CUSTOMER
    // -----------------------------
    if (customerId) {
      const customerRef = db
        .collection("customers")
        .doc(customerId);

      const customerSnap = await customerRef.get();

      if (customerSnap.exists) {
        const customer = customerSnap.data();

        await customerRef.update({
          totalSpent:
            Number(customer.totalSpent || 0) + Number(total),

          totalVisits:
            Number(customer.totalVisits || 0) + 1,

          lastVisit: new Date().toLocaleDateString(),

          updatedAt:
            new Date()
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Payment Successful",
      payment: {
        id: paymentRef.id,
        ...paymentData,
      },
    });
  } catch (error) {
    console.error("Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment Failed",
      error: error.message,
    });
  }
};

// ===============================
// DELETE PAYMENT
// ===============================
const deletePayment = async (req, res) => {
  try {
    await db.collection("payments").doc(req.params.id).delete();

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to delete payment",
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  deletePayment,
};