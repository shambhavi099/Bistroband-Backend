const db = require("../config/firebase");

// ======================================
// REPORT SUMMARY
// ======================================

const getReportSummary = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const validOrders = orders.filter(
      order => order.status !== "cancelled"
    );

    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const count = validOrders.length;

    const averageTicketValue =
      count === 0
        ? 0
        : Number((totalRevenue / count).toFixed(2));

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        count,
        averageTicketValue,
      },
    });
  } catch (error) {
    console.error("Report Summary Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// TOP SELLING ITEMS
// ======================================

const getPopularItems = async (req, res) => {
  try {
    const ordersSnapshot = await db.collection("orders").get();

    const menuSnapshot = await db.collection("menu").get();

    const orders = ordersSnapshot.docs.map(doc => doc.data());

    const menu = menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const itemCounts = {};

    orders.forEach(order => {

      if (order.status === "cancelled") return;

      (order.items || []).forEach(item => {

        if (!itemCounts[item.name]) {

          const matched = menu.find(
            menuItem => menuItem.name === item.name
          );

          itemCounts[item.name] = {
            qty: 0,
            rev: 0,
            cat: matched?.category || "Others",
          };
        }

        itemCounts[item.name].qty += Number(item.quantity);

        itemCounts[item.name].rev +=
          Number(item.quantity) *
          Number(item.price);

      });
    });

    const popularSellers = Object.keys(itemCounts)
      .map(name => ({
        name,
        quantitySold: itemCounts[name].qty,
        revenue: itemCounts[name].rev,
        category: itemCounts[name].cat,
      }))
      .sort(
        (a, b) => b.quantitySold - a.quantitySold
      )
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: popularSellers,
    });

  } catch (error) {

    console.error("Popular Items Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getReportSummary,
  getPopularItems,
};