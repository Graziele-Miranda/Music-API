const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const AlbumDAO = require("../model/Album");

const { authenticateToken } = require("../helpers/auth");

router.get("/list", async (req, res) => {
  let albums = await AlbumDAO.list();
  res.json(sucess(albums, "list"));
});

router.get("/:id", async (req, res) => {
  let obj = await AlbumDAO.getById(req.params.id);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Não foi possível localizar o album"));
});

router.post("/create-album", authenticateToken, async (req, res) => {
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
    const existingAlbum = await AlbumDAO.getByName(titulo);
    if (existingAlbum) {
      return res.status(400).json(fail("Titulo de álbum já cadastrado"));
    }

    let albumCad = await AlbumDAO.save(titulo, artista, ano, genero);
    res.json(sucess({ message: "Album cadastrado com sucesso", albumCad }));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao cadastrar álbum"));
  }
});

router.put("/update-album/:id", async (req, res) => {
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
          .json(fail({ message: "O nome do título do album já está em uso" }));
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
    res.status(500).json(fail({ message: "Erro ao atualizar dados do album" }));
  }
});

router.delete("/delete-album/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
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
});

//Logica de negocio
router.get("/recommendations/:genero", authenticateToken, async (req, res) => {
  const genero = req.params.genero;

  try {
    // Recomendar álbuns com base no gênero
    const recommendedAlbums = await AlbumDAO.getAlbumsByGenre(genero);

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
