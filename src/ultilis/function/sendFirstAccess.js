const sendGrid = require("../../config/sendGrid");
const { credentialsAccessHTML } = require("../htmlEmails/credentialsAccess");

async function sendFirstAccess(user) {
  try {
    const htmlExcel = await credentialsAccessHTML(user);

    const message = {
      from: "schmi@dottie.pro",
      to: user.email,
      subject: `[dottie] Credenciais de Acesso`,
      html: htmlExcel,
    };

    const resultadoEmail = await sendGrid.configEmailSendGrid(message);
    return resultadoEmail;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
  sendFirstAccess,
};
