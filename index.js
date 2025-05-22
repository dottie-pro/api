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

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 45000, // 45 segundos
    serverSelectionTimeoutMS: 45000, // 45 segundos
  })
  .then(async () => {
    console.log("Connected to DB");
    Scheduler.getInstance();
    Routines.start();
  })
  .catch((err) => {
    console.log("ERRO:", err.errors);
  });

mongoose.Promise = global.Promise;

app.listen(port, () => {
  console.log(`API on port ${port}`);
});
