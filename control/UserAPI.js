const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const { sucess, fail } = require("../helpers/resposta");
const UserDAO = require("../model/User");

// Chave secreta para assinar o token JWT
const JWT_SECRET = "YzTrsdE";

// Middleware de autenticação para verificar o token JWT em rotas protegidas
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token de acesso não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token de acesso inválido" });
    }

    req.user = user;
    next();
  });
}

router.get("/", async (req, res) => {
  let user = await UserDAO.list();
  res.json(sucess(user, "list"));
});

// Rota de cadastro de usuários
router.post("/register-user", async (req, res) => {
  const { usuario, nome, senha, email, administrador } = req.body;

  try {
    const user = await UserModel.create({
      usuario,
      nome,
      senha,
      email,
      administrador,
    });
    res.json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
});

// Rota de login e geração de token JWT
router.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const user = await UserDAO.getByUser({ where: { usuario } });

    if (!user || user.senha !== senha) {
      return res.status(401).json({ message: "Usuário ou senha inválida" });
    }

    const token = jwt.sign(
      { usuario, isAdmin: user.administrador },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Rota de atualização de dados pessoais
router.put("/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { usuario, nome, senha, email, administrador } = req.body;

  try {
    const user = await UserDAO.getByUser(id);

    // Verificar se o usuário atual é um administrador ou se é o próprio usuário que está fazendo a requisição
    if (!req.user.isAdmin && req.user.usuario !== user.usuario) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    user.usuario = usuario;
    (user.nome = nome), (user.senha = senha);
    user.email = email;
    user.administrador = administrador;

    await user.save();

    res.json({ message: "Dados pessoais atualizados com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar dados pessoais" });
  }
});

// Rota de exclusão de usuários não administradores
router.delete("/:id", authenticateToken, async (req, res) => {
  // Verificar se o usuário atual é um administrador
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Acesso negado" });
  }

  const id = req.params.id;

  try {
    await User.destroy({ where: { id: id, administrador: false } });
    res.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
});

module.exports = router;
