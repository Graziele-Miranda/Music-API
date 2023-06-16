const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const MusicDAO = require("../model/Music");

const { authenticateToken } = require("../helpers/auth");

router.get("/", async (req, res) => {
  const limite = parseInt(req.query.limit) || 5;
  const pagina = parseInt(req.query.page) || 1;

  try {
    const musics = await MusicDAO.list(limite, pagina);
    res.json(sucess(musics, "list"));
  } catch (error) {
    res.status(500).json(fail("Erro ao obter listagem de músicas."));
  }
});

router.get("/:id", async (req, res) => {
  let obj = await MusicDAO.getById(req.params.id);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Não foi possível localizar a musica"));
});

router.post("/create-music", authenticateToken, async (req, res) => {
  const { titulo, artista, album, duracao } = req.body;

  if (!titulo) {
    return res.status(400).json(fail("O campo titulo deve ser preenchido"));
  }
  try {
    const existingMusic = await MusicDAO.getByName(titulo);
    if (existingMusic) {
      return res.status(400).json(fail("Música já cadastrada"));
    }

    let musicCad = await MusicDAO.save(titulo, artista, album, duracao);
    res.json(sucess({ message: "Musica cadastrada com sucesso", musicCad }));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao cadastrar musica"));
  }
});

router.put("/update-music/:id", authenticateToken, async (req, res) => {
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
          .json(fail({ message: "O nome do título da música já está em uso" }));
      }
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
    res
      .status(500)
      .json(fail({ message: "Erro ao atualizar dados da música" }));
  }
});
router.delete("/delete-music/:id", authenticateToken, async (req, res) => {
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
});

module.exports = router;
