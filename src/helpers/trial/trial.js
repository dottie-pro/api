const User = require("../../models/User");

const canTakeAction = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.paying) {
    return -1;
  }

  if (user.remaining_credits == 0) {
    throw new Error("User has no credits");
  }

  user.remaining_credits -= 1;
  await user.save();

  return user.remaining_credits;
};

module.exports = {
  canTakeAction,
};
