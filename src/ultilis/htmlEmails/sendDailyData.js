async function dailyDataEmailHTML(users, analytics, usersWhoUsed) {
  return `
              <!DOCTYPE html>
              <html lang="en">
              
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              
              <body>
              
                  <div>
                      <div>
                          <p>Métricas de usuários e utilização do dia!</p>
                          <p>Usuários cadastrados: ${users.length}</p>
                          <p>Lista de usuários: ${users
                            .map((user) => user.email)
                            .join(", ")}</p>
                          <p>Análises realizadas: ${analytics.length}</p>
                          <p>Utlizado por: ${usersWhoUsed
                            .map((user) => user.email)
                            .join(", ")}</p>
                      </div>
  
                  <div style="display: flex; align-items: center; justify-content: flex-start; margin-top: 20px;">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                       <img src="https://mf-planejados.s3.amazonaws.com/avatar-dottie.png" alt="Logo da Empresa">
                       <img src="https://mf-planejados.s3.amazonaws.com/logo-dottie.png" alt="Nome da Empresa">
                    </div>
                  </div>
                  </div>
              
              </body>
              
              </html>
          `;
}

module.exports = {
  dailyDataEmailHTML,
};
