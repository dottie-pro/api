require("dotenv").config();
const mongoose = require("mongoose");
const DashboardRoutine = require("../../src/services/routines/dashboardRoutine");

module.exports = async function handler(req, res) {
  try {
    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    console.log("Cron job: Checking new users...");
    await DashboardRoutine.checkNewData();
    console.log("Cron job: New users check completed");

    res.status(200).json({
      success: true,
      message: "New users check completed successfully",
    });
  } catch (error) {
    console.error("Cron job error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
