// importa o framework express (cria o servidor web)
const express = require("express");
// importa o módulo path para construir caminhos de forma segura
const path = require("path");
// importa multer para tratar uploads multipart/form-data (arquivos)
const multer = require("multer");

// cria a aplicação express
const app = express();
// configura multer para salvar arquivos enviados numa pasta "uploads" dentro desta pasta
const upload = multer({ dest: path.join(__dirname, "uploads") });

// armazenará os envios em memória (reinicia quando servidor reiniciar)
const submissions = [];

// Serve arquivos estáticos da pasta atual (por exemplo formularios.html, css, js, imagens)
// Isso permite acessar http://localhost:3000/formularios.html diretamente
app.use(express.static(__dirname));

// Rota raiz: quando alguém acessar "/", redireciona para o formulário
// res.redirect envia um cabeçalho 302 instruindo o navegador a abrir /formularios.html
app.get("/", (req, res) => {
  res.redirect("/formularios.html");
});

// Rota POST que recebe o formulário enviado pelo cliente.
// upload.single('avatar') processa o arquivo 'avatar' se enviado.
app.post("/submit", upload.single("avatar"), (req, res) => {
  // cria um objeto salvo combinando campos e metadados do arquivo
  const record = {
    id: Date.now().toString(36),
    timestamp: new Date().toISOString(),
    fields: req.body,
    file: req.file
      ? {
          // nome original do arquivo no computador do usuário
          originalname: req.file.originalname,
          // nome usado pelo multer no servidor (hash ou id)
          filename: req.file.filename,
          // tipo MIME do arquivo (image/png, etc.)
          mimetype: req.file.mimetype,
          // tamanho em bytes
          size: req.file.size,
        }
      : null,
  };
  // salva em memória
  submissions.push(record);

  console.log("Novo envio:", record);

  // Redireciona o cliente para a página de visualização dos cadastros.
  // Usamos 303 (See Other) para forçar o navegador a fazer GET em /acessa_dados.html
  res.redirect(303, "/acessa_dados.html");
});

// rota que retorna todos os envios em JSON
app.get("/api/submissions", (req, res) => {
  res.json(submissions);
});

// Define a porta (3000 por padrão) e inicia o servidor.
// process.env.PORT permite usar uma porta definida pelo ambiente (útil em deploy).
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // mensagem no console para saber que o servidor subiu e onde acessar
  console.log(`Servidor (único) rodando em http://localhost:${PORT}`);
  console.log(`Abra: http://localhost:${PORT}/formularios.html`);
});
