const db = require("../config/firebase");

const getAdminDashboard = async (req, res) => {
  try {
    const employeesSnapshot = await db.collection("employees").get();
    const ordersSnapshot = await db.collection("orders").get();
    const tablesSnapshot = await db.collection("tables").get();

    const employees = employeesSnapshot.docs;
    const orders = ordersSnapshot.docs;
    const tables = tablesSnapshot.docs;

    const occupiedTables = tables.filter(
      (table) => table.data().status === "OCCUPIED"
    );

    const availableTables = tables.filter(
      (table) => table.data().status === "AVAILABLE"
    );

    const activeOrders = orders.filter(
      (order) =>
        order.data().status === "PREPARING" ||
        order.data().status === "READY"
    );

    res.status(200).json({
      success: true,
      data: {
        totalEmployees: employees.length,
        totalOrders: orders.length,
        activeOrders: activeOrders.length,
        totalTables: tables.length,
        occupiedTables: occupiedTables.length,
        availableTables: availableTables.length,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
};