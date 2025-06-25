const sendGrid = require("../../config/sendGrid");
const { dailyDataEmailHTML } = require("../htmlEmails/sendDailyData");

async function sendDailyData(users, analytics, usersWhoUsed) {
  try {
    const htmlDailyData = await dailyDataEmailHTML(
      users,
      analytics,
      usersWhoUsed
    );
    const yesterdayDate = new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const message = {
      from: "schmi@dottie.pro",
      to: ["schmi@dottie.pro", "erickkarl5@gmail.com"],
      subject: `Dados Diários - ${yesterdayDate}`,
      html: htmlDailyData,
    };

    const resultadoEmail = await sendGrid.configEmailSendGrid(message);
    return resultadoEmail;
  } catch (error) {
    console.log("erro ao enviar email: ", error);
    return error;
  }
}

module.exports = {
  sendDailyData,
};
