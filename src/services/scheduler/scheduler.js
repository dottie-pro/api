const Schedule = require("../../models/Schedule");
const User = require("../../models/User");

class Scheduler {
  constructor() {
    if (Scheduler.instance) {
      return Scheduler.instance;
    }

    this.timers = new Map();
    Scheduler.instance = this;
    this.startTimers().then((trials) => {
      console.log("Scheduler service started!", trials, "trials to start");
    });
  }

  static getInstance() {
    if (!Scheduler.instance) {
      Scheduler.instance = new Scheduler();
    }
    return Scheduler.instance;
  }

  // Inicia os timers dos trials
  // Essa função é chamada pelo service Routines a cada 24 horas
  async startTimers() {
    const trials = await Schedule.find();
    for (const trial of trials) {
      await this.startTimer(trial._id);
    }
    return trials.length;
  }

  // Cria um trial de 30 dias
  static async createTrial(userId) {
    const trial = await Schedule.create({
      userId,
      type: "TRIAL",
      due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    console.log("created trial: ", trial);
    await Scheduler.getInstance().startTimer(trial._id);
    return trial;
  }

  async resetTrial(scheduleId) {
    const trial = await Schedule.findById(scheduleId);
    if (!trial) {
      throw new Error("Trial not found");
    }

    await User.findByIdAndUpdate(trial.userId, {
      $set: {
        remaining_credits: 10,
      },
    });

    trial.due = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await trial.save();
    this.#clearTimer(scheduleId);
    return trial;
  }

  // Inicia o timer de um trial, caso o trial tenha mais de 24 horas, ele não é iniciado
  async startTimer(scheduleId) {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    this.#clearTimer(scheduleId);

    return this.#createTimer(scheduleId, schedule.due, async () => {
      await this.resetTrial(scheduleId);
    });
  }

  #createTimer(scheduleId, dueDate, callback) {
    const timeUntilDue = dueDate.getTime() - Date.now();

    if (timeUntilDue > 25 * 60 * 60 * 1000) {
      return;
    }

    if (timeUntilDue <= 0) {
      callback();
      return;
    }

    const timer = setTimeout(() => {
      callback();
      this.timers.delete(scheduleId);
    }, timeUntilDue);

    this.timers.set(scheduleId, timer);
    return timer;
  }

  #clearTimer(scheduleId) {
    const timer = this.timers.get(scheduleId);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(scheduleId);
    }
  }

  async stopTimer(scheduleId) {
    this.#clearTimer(scheduleId);
  }

  getActiveTimers() {
    return Array.from(this.timers.keys());
  }

  clearAllTimers() {
    for (const [scheduleId] of this.timers) {
      this.#clearTimer(scheduleId);
    }
  }
}

module.exports = { Scheduler };
