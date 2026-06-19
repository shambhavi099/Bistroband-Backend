const db = require("../config/firebase");

const createCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      tier,
      totalVisits,
      totalSpent,
      notes,
    } = req.body;

    const customerData = {
      name,
      phone,
      email,
      tier,
      totalVisits: totalVisits || 0,
      totalSpent: totalSpent || 0,
      notes: notes || "",
      createdAt: new Date(),
    };

    const docRef = await db.collection("customers").add(customerData);

    res.status(201).json({
      success: true,
      customerId: docRef.id,
      data: customerData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const snapshot = await db.collection("customers").get();

    const customers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customerDoc = await db
      .collection("customers")
      .doc(req.params.id)
      .get();

    if (!customerDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: customerDoc.id,
        ...customerDoc.data(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateCustomer = async (req, res) => {
  try {
    const customerRef = db
      .collection("customers")
      .doc(req.params.id);

    const customerDoc = await customerRef.get();

    if (!customerDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customerRef.update(req.body);

    const updatedDoc = await customerRef.get();

    res.status(200).json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customerRef = db
      .collection("customers")
      .doc(req.params.id);

    const customerDoc = await customerRef.get();

    if (!customerDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customerRef.delete();

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};