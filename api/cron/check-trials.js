require("dotenv").config();
const mongoose = require("mongoose");
const { Scheduler } = require("../../src/services/scheduler/scheduler");

module.exports = async function handler(req, res) {
  try {
    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    console.log("Cron job: Checking trials...");
    const scheduler = Scheduler.getInstance();
    await scheduler.startTimers();
    console.log("Cron job: Trials check completed");

    res.status(200).json({
      success: true,
      message: "Trials check completed successfully",
    });
  } catch (error) {
    console.error("Cron job error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
