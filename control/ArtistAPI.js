const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/answer");
const ArtistDAO = require("../model/Artist");

const { authenticateToken } = require("../helpers/auth");

router.get("/list-artist", async (req, res) => {
  const limite = parseInt(req.query.limit) || 5;
  const pagina = parseInt(req.query.page) || 1;

  try {
    const artist = await ArtistDAO.list(limite, pagina);
    res.json(sucess(artist, "list"));
  } catch (error) {
    res.status(500).json(fail("Erro ao obter listagem de artistas."));
  }
});

router.get("/list-artist/:id", async (req, res) => {
  let obj = await ArtistDAO.getById(req.params.id);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Não foi possível localizar o artista"));
});
// ID, Nome, Gênero, País de origem, Biografia.

router.post(
  "/create-artist",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem criar artistas.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const { nome, genero, paisOrigem, biografia } = req.body;

    if (!nome) {
      return res.status(400).json(fail("O campo nome deve ser preenchido"));
    }
    if (!genero) {
      return res.status(400).json(fail("O campo genero deve ser preenchido"));
    }

    try {
      const existingArtist = await ArtistDAO.getByName(nome);
      if (existingArtist) {
        return res.status(400).json(fail("Artista já cadastrado"));
      }

      let artistCad = await ArtistDAO.save(nome, genero, paisOrigem, biografia);
      res.json(
        sucess({ message: "Artista cadastrado com sucesso", artistCad })
      );
    } catch (error) {
      console.error(error);
      if (error.errors && error.errors[0].validatorKey === "len") {
        const errorMessage = error.errors[0].message;
        return res.status(400).json(fail({ message: errorMessage }));
      }
      res.status(500).json(fail("Erro ao cadastrar artista"));
    }
  }
);

router.put(
  "/update-artist/:id",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem alterar artistas.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const { id } = req.params;
    const { nome, genero, paisOrigem, biografia } = req.body;

    if (!nome) {
      return res.status(400).json(fail("O campo nome deve ser preenchido"));
    }
    if (!genero) {
      return res.status(400).json(fail("O campo genero deve ser preenchido"));
    }

    try {
      const artist = await ArtistDAO.getById(id);
      if (!artist) {
        return res
          .status(404)
          .json(fail({ message: "Artista não encontrado" }));
      }

      if (nome !== artist.nome) {
        const existingArtist = await ArtistDAO.getByName(nome);
        if (existingArtist && existingArtist.id !== artist.id) {
          return res
            .status(400)
            .json(fail({ message: "O nome do artista já está em uso" }));
        }
      }

      artist.nome = nome;
      artist.genero = genero;
      artist.paisOrigem = paisOrigem;
      artist.biografia = biografia;

      await artist.save();
      res.json(
        sucess({ message: "Dados do artista atualizados com sucesso", artist })
      );
    } catch (error) {
      console.error(error);
      if (error.errors && error.errors[0].validatorKey === "len") {
        const errorMessage = error.errors[0].message;
        return res.status(400).json(fail({ message: errorMessage }));
      }
      res
        .status(500)
        .json(fail({ message: "Erro ao atualizar dados do artista" }));
    }
  }
);

router.delete(
  "/delete-artist/:id",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem excluir artistas.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const id = req.params.id;

    try {
      const artist = await ArtistDAO.getById(id);

      if (!artist) {
        return res
          .status(404)
          .json(fail({ message: "Artista não encontrado" }));
      }

      await ArtistDAO.delete(id);
      res.json(sucess({ message: "Artista excluído com sucesso" }));
    } catch (error) {
      console.error(error);
      res.status(500).json(fail({ message: "Erro ao excluir artista" }));
    }
  }
);

module.exports = router;
