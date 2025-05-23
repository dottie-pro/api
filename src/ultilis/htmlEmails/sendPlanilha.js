async function planilhaEmailHTML(user) {
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
                        <p>Oi, ${user.name}! 🧡</p>
                        <p>Seu arquivo está prontinho e recheado com todos os dados que você adicionou. Dá uma olhada no seu email – a planilha com as informações processadas está anexa, prontinha pra você analisar com calma. ✨</p>
                        <p>Ah, e se quiser ver mais detalhes ou explorar seu histórico de arquivos, é só acessar o  <a href="https://leitor.dottie.pro" target="_blank">painel da dottie</a>. Estou aqui pra te ajudar em cada insight e descoberta! 🚀</p>
                        <p>Vamos nessa? 📊🧡</p>
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
  planilhaEmailHTML,
};
