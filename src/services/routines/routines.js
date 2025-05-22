const { Scheduler } = require("../scheduler/scheduler");

class Routines {
  constructor() {
    this.hour = 0;
    this.scheduler = Scheduler.getInstance();
    this.dailyTimer = null;

    // Inicia o timer na api, que rodará sempre na hora indicada todos os dias (para evitar criação de muitos timeouts de trial)
    this.setRoutineCheckTrial(this.hour);

    console.log("Routines service started! Routine check hour:", this.hour);
  }

  static start() {
    if (Routines.instance) {
      return Routines.instance;
    }

    Routines.instance = new Routines();
    return Routines.instance;
  }

  async setRoutineCheckTrial(hour = 0) {
    if (this.dailyTimer) {
      clearTimeout(this.dailyTimer);
    }

    const scheduleNextRun = () => {
      const now = new Date();
      const nextRun = new Date(now);
      nextRun.setHours(hour, 0, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (now > nextRun) {
        nextRun.setDate(nextRun.getDate() + 1);
      }

      const timeUntilNextRun = nextRun.getTime() - now.getTime();

      this.dailyTimer = setTimeout(async () => {
        await this.scheduler.startTimers();
        scheduleNextRun(); // Schedule the next run
      }, timeUntilNextRun);
    };

    // Start the scheduling
    scheduleNextRun();
  }
}

module.exports = { Routines };
