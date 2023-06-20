const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const AlbumDAO = require("../model/Album");

const { authenticateToken } = require("../helpers/auth");

router.get("/", async (req, res) => {
  const limite = parseInt(req.query.limit) || 10;
  const pagina = parseInt(req.query.page) || 1;

  try {
    const albums = await AlbumDAO.list(limite, pagina);
    res.json(sucess(albums, "list"));
  } catch (error) {
    res.status(500).json(fail("Erro ao obter listagem de álbuns."));
  }
});

router.get("/:id", async (req, res) => {
  let obj = await AlbumDAO.getById(req.params.id);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Não foi possível localizar o album"));
});

router.post(
  "/create-album",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message: "Acesso negado, somente administradores podem criar álbuns.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const { titulo, artista, ano, genero } = req.body;

    if (!titulo) {
      return res.status(400).json(fail("O campo título deve ser preenchido"));
    }
    if (!artista) {
      return res.status(400).json(fail("O campo artista deve ser preenchido"));
    }
    if (!ano) {
      return res.status(400).json(fail("O campo ano deve ser preenchido"));
    }
    if (!genero) {
      return res.status(400).json(fail("O campo gênero deve ser preenchido"));
    }

    try {
      const existingAlbum = await AlbumDAO.getByName(titulo);
      if (existingAlbum) {
        return res.status(400).json(fail("Título de álbum já cadastrado"));
      }

      let albumCad = await AlbumDAO.save(titulo, artista, ano, genero);
      res.json(sucess({ message: "Álbum cadastrado com sucesso", albumCad }));
    } catch (error) {
      console.error(error);
      res.status(500).json(fail("Erro ao cadastrar álbum"));
    }
  }
);

router.put(
  "/update-album/:id",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem atualizar álbuns.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, ano, genero } = req.body;

    if (!titulo) {
      return res.status(400).json(fail("O campo titulo deve ser preenchido"));
    }
    if (!artista) {
      return res.status(400).json(fail("O campo artista deve ser preenchido"));
    }
    if (!ano) {
      return res.status(400).json(fail("O campo ano deve ser preenchido"));
    }
    if (!genero) {
      return res.status(400).json(fail("O campo genero deve ser preenchido"));
    }

    try {
      const album = await AlbumDAO.getById(id);

      if (!album) {
        return res.status(404).json(fail({ message: "Albúm não encontrado" }));
      }

      if (titulo !== album.titulo) {
        const existingAlbum = await AlbumDAO.getByName(titulo);
        if (existingAlbum && existingAlbum.id !== album.id) {
          return res
            .status(400)
            .json(
              fail({ message: "O nome do título do album já está em uso" })
            );
        }
      }
      album.titulo = titulo;
      album.artista = artista;
      album.ano = ano;
      album.genero = genero;

      await album.save();
      res.json(
        sucess({ message: "Dados do album atualizados com sucesso", album })
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(fail({ message: "Erro ao atualizar dados do album" }));
    }
  }
);

router.delete(
  "/delete-album/:id",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem excluir álbuns.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const { id } = req.params;
    try {
      const album = await AlbumDAO.getById(id);

      if (!album) {
        return res.status(404).json(fail({ message: "Album não encontrado" }));
      }
      await AlbumDAO.delete(id);
      res.json(sucess({ message: "Album excluído com sucesso" }));
    } catch (error) {
      console.error(error);
      res.status(500).json(fail({ message: "Erro ao excluir album" }));
    }
  }
);

//Logica de negocio
router.get("/recommendations/:genero", authenticateToken, async (req, res) => {
  const genero = req.params.genero;
  const limite = parseInt(req.query.limit) || 5;
  const pagina = parseInt(req.query.page) || 1;

  try {
    // Recomendar álbuns com base no gênero, com paginação
    const recommendedAlbums = await AlbumDAO.getAlbumsByGenre(
      genero,
      limite,
      pagina
    );

    // Verificar se há recomendações
    if (recommendedAlbums.length === 0) {
      return res.json(fail("Não há recomendações para esse gênero"));
    }

    res.json(sucess(recommendedAlbums, "recommendations"));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Falha ao recomendar álbuns"));
  }
});

module.exports = router;
