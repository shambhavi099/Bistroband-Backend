const admin = require("firebase-admin");
const db = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

const getSystemConfig = async (req, res) => {
  try {
    const doc = await db
      .collection("systemConfig")
      .doc("config")
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "System configuration not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data(),
      },
    });
  } catch (error) {
    console.error("Get Config Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch system configuration",
      error: error.message,
    });
  }
};

const updateSystemConfig = async (req, res) => {
  try {
    const {
      restaurantName,
      taxRate,
      serviceChargeRate,
      enableTableCleanup,
      preparationBuffer,
    } = req.body;

    const configData = {
      restaurantName,
      taxRate: Number(taxRate),
      serviceChargeRate: Number(serviceChargeRate),
      enableTableCleanup: Boolean(enableTableCleanup),
      preparationBuffer: Number(preparationBuffer),

      updatedAt: FieldValue.serverTimestamp(),
    };

    await db
      .collection("systemConfig")
      .doc("config")
      .set(configData);

    return res.status(200).json({
      success: true,
      message: "System configuration updated successfully",
      data: configData,
    });

  } catch (error) {
    console.error("Update Config Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update system configuration",
      error: error.message,
    });
  }
};

const getPromoCampaigns = async (req, res) => {
  try {
    const snapshot = await db
      .collection("promoCampaigns")
      .orderBy("createdAt", "desc")
      .get();

    const campaigns = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      data: campaigns,
    });

  } catch (error) {
    console.error("Get Promo Campaigns Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch promo campaigns",
      error: error.message,
    });
  }
};

const createPromoCampaign = async (req, res) => {
  try {
    const {
      code,
      discountPct,
      description,
      isActive,
    } = req.body;

    if (!code || !discountPct) {
      return res.status(400).json({
        success: false,
        message: "Code and discount percentage are required",
      });
    }

    // Check duplicate coupon code
    const promoRef = db
      .collection("promoCampaigns")
      .doc(code.toUpperCase());

    const promoSnap = await promoRef.get();

    if (promoSnap.exists) {
      return res.status(400).json({
        success: false,
        message: "Promo code already exists",
      });
    }

    const promoData = {
      code: code.toUpperCase(),
      discountPct: Number(discountPct),
      description:
        description ||
        `${discountPct}% OFF Promotional Campaign`,
      isActive:
        isActive !== undefined ? isActive : true,

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await promoRef.set(promoData);;

    return res.status(201).json({
      success: true,
      message: "Promo campaign created successfully",
      data: {
        id: promoRef.id,
        ...promoData,
      },
    });

  } catch (error) {
    console.error("Create Promo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create promo campaign",
      error: error.message,
    });
  }
};

const togglePromoCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const promoRef = db
      .collection("promoCampaigns")
      .doc(id);

    const promoSnap = await promoRef.get();

    if (!promoSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Promo campaign not found",
      });
    }

    const promo = promoSnap.data();

    await promoRef.update({
      isActive: !promo.isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "Promo campaign updated successfully",
    });

  } catch (error) {
    console.error("Toggle Promo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update promo campaign",
      error: error.message,
    });
  }
};

const deletePromoCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const promoRef = db
      .collection("promoCampaigns")
      .doc(id);

    const promoSnap = await promoRef.get();

    if (!promoSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Promo campaign not found",
      });
    }

    await promoRef.delete();

    return res.status(200).json({
      success: true,
      message: "Promo campaign deleted successfully",
    });

  } catch (error) {
    console.error("Delete Promo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete promo campaign",
      error: error.message,
    });
  }
};


const getAuditLogs = async (req, res) => {
  try {

    const snapshot = await db
      .collection("auditLogs")
      .orderBy("createdAt", "desc")
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      data: logs,
    });

  } catch (error) {

    console.error("Get Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message,
    });

  }
};

const createAuditLog = async (req, res) => {
  try {

    const {
      category,
      action,
      severity,
      user,
    } = req.body;

    const logData = {
      category,
      action,
      severity,
      user,

      timestamp: new Date().toLocaleTimeString(),

      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db
      .collection("auditLogs")
      .add(logData);

    return res.status(201).json({
      success: true,
      message: "Audit log created",
      data: {
        id: docRef.id,
        ...logData,
      },
    });

  } catch (error) {

    console.error("Create Audit Log Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create audit log",
      error: error.message,
    });

  }
};


const deleteAuditLog = async (req, res) => {
  try {

    const { id } = req.params;

    const logRef = db.collection("auditLogs").doc(id);

    const logDoc = await logRef.get();

    if (!logDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found",
      });
    }

    await logRef.delete();

    return res.status(200).json({
      success: true,
      message: "Audit log deleted",
    });

  } catch (error) {

    console.error("Delete Audit Log Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete audit log",
      error: error.message,
    });

  }
};

const clearAuditLogs = async (req, res) => {
  try {

    const snapshot = await db.collection("auditLogs").get();

    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return res.status(200).json({
      success: true,
      message: "All audit logs cleared",
    });

  } catch (error) {

    console.error("Clear Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear audit logs",
      error: error.message,
    });

  }
};

module.exports = {
  getSystemConfig,
  updateSystemConfig,

  getPromoCampaigns,
  createPromoCampaign,
  togglePromoCampaignStatus,
  deletePromoCampaign,

  getAuditLogs,
  createAuditLog,
  deleteAuditLog,
  clearAuditLogs
  
};