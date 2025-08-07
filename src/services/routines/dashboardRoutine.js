const FileTextData = require("../../models/FileTextData");
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

    console.log("Excluded users:", excludedUsers);

    const excludedUserIds = excludedUsers.map((user) => user._id);

    const usersFromYesterday = await User.find({
      createdAt: {
        $gte: yesterday,
        $lt: today,
      },
      _id: { $nin: excludedUserIds },
    });

    console.log("Users from yesterday:", usersFromYesterday);

    const fileTextData = await FileTextData.find({
      createdAt: {
        $gte: yesterday,
        $lt: today,
      },
      userId: {
        $nin: excludedUserIds,
      },
    });

    console.log("File text data:", fileTextData);
    console.log("User ids who used:", userIdsWhoUsed);

    const userIdsWhoUsed = fileTextData.map((analysis) => analysis.userId);
    const usersWhoUsed = await User.find({
      _id: { $in: userIdsWhoUsed },
    });

    sendDailyData(usersFromYesterday, fileTextData, usersWhoUsed);
  }
}

module.exports = DashboardRoutine;
