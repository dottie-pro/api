const routes = require("express").Router();
const UserController = require("../controllers/UserController");
const FileController = require("../controllers/FileController");
const { checkAuth } = require("../helpers/auth/checkAuth");
const multer = require("multer");
const multerConfig = require("../config/multer");
const CustomerController = require("../controllers/CustomerController");
const AnalyticsController = require("../controllers/AnalyticsController");
const TextDataFilesController = require("../controllers/TextDataFilesController");
const ReportsController = require("../controllers/ReportsController");

//User Routes
routes.get("/", async (req, res) => {
  return res.status(200).json({ msg: "Public Route" });
});
routes.post(
  "/user/logo",
  [checkAuth, multer(multerConfig).single("file")],
  UserController.uploadLogo
);
routes.get("/user/logo", checkAuth, UserController.getLogo);
routes.delete("/user/logo/:id", checkAuth, UserController.deleteLogo);
routes.post("/user/login", UserController.login);
routes.get("/user/list", UserController.list);
routes.post("/user/create", UserController.add);
routes.get("/user/:id", checkAuth, UserController.readById);
routes.post("/user/loginbytoken", checkAuth, UserController.loginByToken);
routes.delete("/user/delete/:id", checkAuth, UserController.delete);
routes.patch("/user/update/:id", checkAuth, UserController.update);
routes.patch("/user/password/:id", checkAuth, UserController.updatePassword);

//Customer
routes.get("/customer/list", checkAuth, CustomerController.list);
routes.get("/customer/list/filter", checkAuth, CustomerController.listFiltered);
routes.post("/customer/create", checkAuth, CustomerController.add);
routes.get("/customer/:id", checkAuth, CustomerController.readById);
routes.delete("/customer/delete/:id", checkAuth, CustomerController.delete);
routes.patch("/customer/update/:id", checkAuth, CustomerController.update);

//Analytics
routes.get("/analytics/list", checkAuth, AnalyticsController.list);
routes.post("/analytics/create", checkAuth, AnalyticsController.add);
routes.get("/analytics/:id", checkAuth, AnalyticsController.readById);
routes.delete("/analytics/delete/:id", checkAuth, AnalyticsController.delete);
routes.patch("/analytics/update/:id", checkAuth, AnalyticsController.update);

//TextDataFiles
routes.get("/filesData/list", checkAuth, TextDataFilesController.list);
routes.get("/filesData/:id", checkAuth, TextDataFilesController.readById);
routes.delete(
  "/filesData/delete/:id",
  checkAuth,
  TextDataFilesController.delete
);
routes.patch(
  "/filesData/update/:id",
  checkAuth,
  TextDataFilesController.update
);
routes.post(
  "/filesData/send-planilha-email",
  checkAuth,
  TextDataFilesController.sendTextDataInPlanilha
);

//Reports
routes.get("/report/dashboard", checkAuth, ReportsController.reportDashboard);

// Cron job routes
routes.get("/cron/check-new-users", async (req, res) => {
  try {
    require("dotenv").config();
    const mongoose = require("mongoose");
    const DashboardRoutine = require("../services/routines/dashboardRoutine");

    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    await DashboardRoutine.checkNewData();

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
});

routes.get("/cron/check-trials", async (req, res) => {
  try {
    require("dotenv").config();
    const mongoose = require("mongoose");
    const { Scheduler } = require("../services/scheduler/scheduler");

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
});

// //File Routes
routes.post(
  "/file/upload",
  multer(multerConfig).single("file"),
  FileController.upload
);
routes.post(
  "/file/upload-and-process-text",
  multer(multerConfig).single("file"),
  FileController.uploadAndProcessText
);
routes.delete("/upload/:fileId", checkAuth, FileController.delete);

module.exports = routes;
