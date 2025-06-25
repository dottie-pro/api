const Analytics = require("../../models/Analytics");
const User = require("../../models/User");
const { sendDailyData } = require("../../ultilis/function/sendDailyData");

class DashboardRoutine {
  constructor() {}

  static async checkNewData() {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const today = new Date();

    console.log("Checking new data...", yesterday);
    // First, get the userIds for the emails we want to exclude
    const excludedUsers = await User.find({
      email: { $in: ["erickkarl5@gmail.com", "schmi@dottie.pro"] },
    });

    const excludedUserIds = excludedUsers.map((user) => user._id);

    const usersFromYesterday = await User.find({
      createdAt: {
        $gte: yesterday,
        $lt: today,
      },
      _id: { $nin: excludedUserIds },
    });

    const analyticsFromYesterday = await Analytics.find({
      createdAt: {
        $gte: yesterday,
        $lt: today,
      },
      userId: {
        $nin: excludedUserIds,
      },
    });

    const userIdsWhoUsed = analyticsFromYesterday.map(
      (analysis) => analysis.userId
    );
    const usersWhoUsed = await User.find({
      _id: { $in: userIdsWhoUsed },
    });

    sendDailyData(usersFromYesterday, analyticsFromYesterday, usersWhoUsed);
  }
}

module.exports = DashboardRoutine;
