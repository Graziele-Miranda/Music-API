const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/answer");
const MusicDAO = require("../model/Music");
const AlbumDAO = require("../model/Album");
const ArtistDAO = require("../model/Artist");

const { authenticateToken } = require("../helpers/auth");

router.get("/list-music", async (req, res) => {
  const limite = parseInt(req.query.limit) || 5;
  const pagina = parseInt(req.query.page) || 1;

  try {
    const musics = await MusicDAO.list(limite, pagina);
    res.json(sucess(musics, "list"));
  } catch (error) {
    res.status(500).json(fail("Erro ao obter listagem de músicas."));
  }
});

router.get("/list-music/:id", async (req, res) => {
  let obj = await MusicDAO.getById(req.params.id);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Não foi possível localizar a musica"));
});
//Mostrar lista de músicas de um determinado album
router.get("/list-music/:id/albums", async (req, res) => {
  const id = req.params.id;
  const limite = parseInt(req.query.limit) || 5;
  const pagina = parseInt(req.query.page) || 1;

  try {
    const musicAlbums = await MusicDAO.getAlbumMusic(id, limite, pagina);
    if (musicAlbums.length === 0) {
      return res.json(fail("Não há álbuns para essa década"));
    }
    res.json(sucess(musicAlbums, "albums"));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao obter as músicas do álbum"));
  }
});

router.post(
  "/create-music",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem criar músicas.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const { titulo, artista, album, duracao } = req.body;

    if (!titulo) {
      return res.status(400).json(fail("O campo titulo deve ser preenchido"));
    }
    try {
      const existingMusic = await MusicDAO.getByName(titulo);
      if (existingMusic) {
        return res.status(400).json(fail("Música já cadastrada"));
      }
      const existingAlbum = await AlbumDAO.getById(album);
      if (!existingAlbum) {
        return res.status(400).json(fail("O ID do álbum não existe"));
      }
      const existingArtist = await ArtistDAO.getById(artista);
      if (!existingArtist) {
        return res.status(400).json(fail("O ID do artista não existe"));
      }

      let musicCad = await MusicDAO.save(titulo, artista, album, duracao);
      res.json(sucess({ message: "Musica cadastrada com sucesso", musicCad }));
    } catch (error) {
      console.error(error);
      if (error.errors && error.errors[0].validatorKey === "len") {
        const errorMessage = error.errors[0].message;
        return res.status(400).json(fail({ message: errorMessage }));
      }
      res.status(500).json(fail("Erro ao cadastrar musica"));
    }
  }
);

router.put(
  "/update-music/:id",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem atualizar músicas.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, album, duracao } = req.body;

    if (!titulo) {
      return res.status(400).json(fail("O campo titulo deve ser preenchido"));
    }
    try {
      const music = await MusicDAO.getById(id);

      if (!music) {
        return res.status(404).json(fail({ message: "Música não encontrada" }));
      }

      if (titulo !== music.titulo) {
        const existingMusic = await MusicDAO.getByName(titulo);
        if (existingMusic && existingMusic.id !== music.id) {
          return res
            .status(400)
            .json(
              fail({ message: "O nome do título da música já está em uso" })
            );
        }
      }
      const existingAlbum = await AlbumDAO.getById(album);
      if (!existingAlbum) {
        return res.status(400).json(fail("O ID do álbum não existe"));
      }
      const existingArtist = await ArtistDAO.getById(artista);
      if (!existingArtist) {
        return res.status(400).json(fail("O ID do artista não existe"));
      }
      music.titulo = titulo;
      music.artista = artista;
      music.album = album;
      music.duracao = duracao;

      await music.save();
      res.json(
        sucess({
          message: "Dados da música foram atualizados com sucesso",
          music,
        })
      );
    } catch (error) {
      console.error(error);
      if (error.errors && error.errors[0].validatorKey === "len") {
        const errorMessage = error.errors[0].message;
        return res.status(400).json(fail({ message: errorMessage }));
      }
      res
        .status(500)
        .json(fail({ message: "Erro ao atualizar dados da música" }));
    }
  }
);
router.delete(
  "/delete-music/:id",
  authenticateToken,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json(
        fail({
          message:
            "Acesso negado, somente administradores podem excluir músicas.",
        })
      );
    }
    next();
  },
  async (req, res) => {
    const id = req.params.id;
    try {
      const music = await MusicDAO.getById(id);

      if (!music) {
        return res.status(404).json(fail({ message: "Música não encontrada" }));
      }
      await MusicDAO.delete(id);
      res.json(sucess({ message: "Música excluída com sucesso" }));
    } catch (error) {
      console.error(error);
      res.status(500).json(fail({ message: "Erro ao excluir música" }));
    }
  }
);

module.exports = router;
