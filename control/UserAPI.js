const express = require("express");
const router = express.Router();
const { sucess, fail } = require("../helpers/resposta");
const UserDAO = require("../model/User");
const { authenticateToken } = require("../helpers/auth");

const jwt = require("jsonwebtoken");

//listar todos users
router.get("/", async (req, res) => {
  let users = await UserDAO.list();
  res.json(sucess(users, "list"));
});

// Rota de login e geração de token JWT
router.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const user = await UserDAO.getByUser(usuario);

    if (!user) {
      return res.status(401).json(fail({ message: "Usuário inválido" }));
    }

    if (user.senha !== senha) {
      return res.status(401).json(fail({ message: "Senha inválida" }));
    }

    const token = jwt.sign(
      { usuario, isAdmin: user.administrador },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error(fail("Erro ao fazer login:", error));
    res.status(500).json(fail({ error: "Erro ao fazer login" }));
  }
});

// -- Users Comuns
// Rota de cadastro de usuários
router.post("/create-user", async (req, res) => {
  const { usuario, nome, email, senha, administrador } = req.body;

  if (!usuario) {
    return res
      .status(400)
      .json(fail({ message: "O campo usuario deve ser preenchido" }));
  }
  if (!nome) {
    return res
      .status(400)
      .json(fail({ message: "O campo nome deve ser preenchido" }));
  }
  if (!email) {
    return res
      .status(400)
      .json(fail({ message: "O campo email deve ser preenchido" }));
  }
  if (!senha) {
    return res
      .status(400)
      .json(fail({ message: "O campo senha deve ser preenchido" }));
  }
  try {
    const existingUser = await UserDAO.getByUser(usuario);
    if (existingUser) {
      return res
        .status(400)
        .json(fail({ message: "Nome de usuário já cadastrado" }));
    }

    const existingEmail = await UserDAO.getByEmail(email);
    if (existingEmail) {
      return res.status(400).json(fail({ message: "E-mail já cadastrado" }));
    }

    const user = await UserDAO.save(usuario, nome, email, senha, false);
    res.json(sucess({ message: "Usuário cadastrado com sucesso", user }));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail({ message: "Erro ao cadastrar usuário" }));
  }
});

// Rota de atualização de dados pessoais
router.put("/update-user/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { usuario, nome, email, senha, administrador } = req.body;

  if (!usuario) {
    return res
      .status(400)
      .json(fail({ message: "O campo usuario deve ser preenchido" }));
  }
  if (!nome) {
    return res
      .status(400)
      .json(fail({ message: "O campo nome deve ser preenchido" }));
  }
  if (!email) {
    return res
      .status(400)
      .json(fail({ message: "O campo email deve ser preenchido" }));
  }
  if (!senha) {
    return res
      .status(400)
      .json(fail({ message: "O campo senha deve ser preenchido" }));
  }

  try {
    const user = await UserDAO.getById(userId);

    if (!user) {
      return res.status(404).json(fail({ message: "Usuário não encontrado" }));
    }

    // Verificar se o usuário atual é um administrador ou comum
    if (!req.user.isAdmin && req.user.usuario !== user.usuario) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, usuarios comuns só têm permissão para alterar seu próprio cadastro",
        })
      );
    }

    // Verificar se o nome de usuário foi alterado e se já está em uso por outro usuário
    if (usuario !== user.usuario) {
      const existingUser = await UserDAO.getByUser(usuario);
      if (existingUser && existingUser.id !== user.id) {
        return res
          .status(400)
          .json(fail({ message: "O nome de usuário já está em uso" }));
      }
    }

    // Verificar se o email foi alterado e se já está em uso por outro usuário
    if (email !== user.email) {
      const existingEmail = await UserDAO.getByEmail(email);
      if (existingEmail && existingEmail.id !== user.id) {
        return res
          .status(400)
          .json(fail({ message: "O email já está em uso" }));
      }
    }

    // Atualizar os dados do usuário
    user.usuario = usuario;
    user.nome = nome;
    user.email = email;
    user.senha = senha;
    user.administrador = administrador;

    await user.save();
    res.json(
      sucess({ message: "Dados pessoais atualizados com sucesso", user })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(fail({ message: "Erro ao atualizar dados pessoais" }));
  }
});

//-- ADMIN
// Rota de criação de administradores
router.post("/register-admin", authenticateToken, async (req, res) => {
  // Verificar se o usuário atual é um administrador
  if (!req.user.isAdmin) {
    return res.status(403).json(
      fail({
        message:
          "Acesso negado, você deve ser um admin para registrar um administrador",
      })
    );
  }

  const { usuario, nome, email, senha } = req.body;

  if (!usuario) {
    return res
      .status(400)
      .json(fail({ message: "O campo usuario deve ser preenchido" }));
  }
  if (!nome) {
    return res
      .status(400)
      .json(fail({ message: "O campo nome deve ser preenchido" }));
  }
  if (!email) {
    return res
      .status(400)
      .json(fail({ message: "O campo email deve ser preenchido" }));
  }
  if (!senha) {
    return res
      .status(400)
      .json(fail({ message: "O campo senha deve ser preenchido" }));
  }

  try {
    const existingUser = await UserDAO.getByUser(usuario);
    if (existingUser) {
      return res
        .status(400)
        .json(fail({ message: "Nome de usuário já cadastrado" }));
    }

    const existingEmail = await UserDAO.getByEmail(email);
    if (existingEmail) {
      return res.status(400).json(fail({ message: "E-mail já cadastrado" }));
    }

    let adminUser = await UserDAO.save(usuario, nome, email, senha, true);
    res.json(
      sucess({ message: "Administrador cadastrado com sucesso", adminUser })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(fail({ message: "Erro ao cadastrar administrador" }));
  }
});

// Rota de atualização de dados pessoais de adm ou user comum, através de um adm
router.put("/update-adm/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { usuario, nome, email, senha, administrador } = req.body;

  if (!usuario) {
    return res
      .status(400)
      .json(fail({ message: "O campo usuario deve ser preenchido" }));
  }
  if (!nome) {
    return res
      .status(400)
      .json(fail({ message: "O campo nome deve ser preenchido" }));
  }
  if (!email) {
    return res
      .status(400)
      .json(fail({ message: "O campo email deve ser preenchido" }));
  }
  if (!senha) {
    return res
      .status(400)
      .json(fail({ message: "O campo senha deve ser preenchido" }));
  }

  try {
    const user = await UserDAO.getById(id);

    if (!user) {
      return res.status(404).json(fail({ message: "Usuário não encontrado" }));
    }

    // Verificar se o usuário atual é um administrador ou comum
    if (!req.user.isAdmin && req.user.usuario !== user.usuario) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, apenas Adm podem realizar alterações nessa rota",
        })
      );
    }

    if (usuario !== user.usuario) {
      const existingUser = await UserDAO.getByUser(usuario);
      if (existingUser && existingUser.id !== user.id) {
        return res
          .status(400)
          .json(fail({ message: "O nome de usuário já está em uso" }));
      }
    }

    if (email !== user.email) {
      const existingEmail = await UserDAO.getByEmail(email);
      if (existingEmail && existingEmail.id !== user.id) {
        return res
          .status(400)
          .json(fail({ message: "O email já está em uso" }));
      }
    }

    user.usuario = usuario;
    user.nome = nome;
    user.email = email;
    user.senha = senha;
    user.administrador = administrador;

    await user.save();

    res.json(sucess({ message: "Dados pessoais atualizados com sucesso" }));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail({ message: "Erro ao atualizar dados pessoais" }));
  }
});

// Rota de exclusão de usuários não administradores
router.delete("/delete-user/:id", authenticateToken, async (req, res) => {
  // Verificar se o usuário atual é um administrador
  if (!req.user.isAdmin) {
    return res.status(403).json(fail({ message: "Acesso negado" }));
  }

  const id = req.params.id;

  try {
    const user = await UserDAO.getById(id);

    if (!user) {
      return res.status(404).json(fail({ message: "Usuário não encontrado" }));
    }

    // Verificar se o usuário a ser excluído é um administrador
    if (user.administrador) {
      return res
        .status(400)
        .json(fail({ message: "Não é possível excluir um administrador" }));
    }

    await UserDAO.delete(id);
    res.json(sucess({ message: "Usuário excluído com sucesso" }));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail({ message: "Erro ao excluir usuário" }));
  }
});

module.exports = router;
