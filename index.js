require("dotenv").config();
const express = require("express");
const routes = require("./src/routes");
const mongoose = require("mongoose");
const cors = require("cors");
const { Scheduler } = require("./src/services/scheduler/scheduler");
const { Routines } = require("./src/services/routines/routines");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maximum connections in pool
      minPoolSize: 5, // Minimum connections in pool
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      heartbeatFrequencyMS: 10000, // Ping every 10s
      retryWrites: true,
    });

    Scheduler.getInstance();
    Routines.start();
  } catch (error) {
    console.log("ERRO:", error.errors);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  connectDB();
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
  connectDB();
});

mongoose.Promise = global.Promise;

app.listen(port, () => {
  console.log(`API on port ${port}`);
});
