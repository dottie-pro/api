const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  due: {
    type: Date,
    required: false,
  },
  type: {
    type: String,
    enum: ["TRIAL"],
    required: false,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
