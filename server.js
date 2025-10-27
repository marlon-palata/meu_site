const path = require("path");
// Verifica se o comando foi executado dentro da pasta "formularios_tabelas"
if (path.basename(process.cwd()).toLowerCase() === "formularios_tabelas") {
  console.error("");
  console.error(
    "Você está executando o node dentro da pasta 'formularios_tabelas'."
  );
  console.error("Por favor execute o servidor a partir da raiz do projeto:");
  console.error("  cd c:\\Users\\Instrutor\\Documents\\GitHub\\meu_site");
  console.error("  node --watch server.js");
  console.error("");
  console.error("Ou, a partir de 'formularios_tabelas' execute:");
  console.error("  node --watch ../server.js");
  console.error("");
  console.error("Arquivo server.js na raiz não é mais usado.");
  console.error(
    "Use apenas o server.js dentro da pasta 'formularios_tabelas':"
  );
  console.error(
    "  cd c:\\Users\\Instrutor\\Documents\\GitHub\\meu_site\\formularios_tabelas"
  );
  console.error("  node --watch server.js");
  console.error("");
  process.exit(1);
}

const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ dest: path.join(__dirname, "uploads") });

// Parse URL-encoded bodies (não necessário para multipart — multer cuida dos arquivos)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Forçar a raiz a abrir o formulário diretamente
app.get("/", (req, res) => {
  // redireciona para o arquivo estático formularios.html
  res.redirect("/formularios.html");
});

// servir a pasta com o HTML e outros assets (acessível em /formularios.html, /styles.css, etc.)
app.use(express.static(path.join(__dirname, "formularios_tabelas")));

// Rota que recebe o formulário (campo de arquivo: "avatar")
app.post("/submit", upload.single("avatar"), (req, res) => {
  // req.body tem os campos do formulário
  // req.file tem informações do arquivo enviado (se houver)
  console.log("Campos do formulário:", req.body);
  console.log("Arquivo recebido:", req.file);

  // Exemplo: responder com JSON de confirmação
  res.json({
    message: "Formulário recebido com sucesso",
    fields: req.body,
    file: req.file
      ? {
          originalname: req.file.originalname,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : null,
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
