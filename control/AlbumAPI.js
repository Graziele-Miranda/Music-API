const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const AlbumDAO = require("../model/Album");

router.get("/", async (req, res) => {
  let albums = await AlbumDAO.list();
  res.json(sucess(albums, "list"));
});

router.get("/:id", async (req, res) => {
  let obj = await AlbumDAO.getById(req.params.id);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Não foi possível localizar o album"));
});

router.post("/", async (req, res) => {
  const { titulo, artista, ano, genero } = req.body;
  //TODO validar os campos
  let obj = await AlbumDAO.save(titulo, artista, ano, genero);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Falha ao salvar o novo album"));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, artista, ano, genero } = req.body;

  let obj = {};
  if (titulo) obj.titulo = titulo;
  if (artista) obj.artista = artista;
  if (ano) obj.ano = ano;
  if (genero) obj.genero = genero;

  if (obj == {}) {
    return res.status(500).json(fail("Nenhum atributo foi modificado"));
  }

  AlbumDAO.update(id, obj)
    .then((album) => {
      if (album) res.json(sucess(album));
      else res.status(500).json(fail("Album nao encontrado"));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Falha ao alterar album"));
    });
});

router.delete("/:id", async (req, res) => {
  let result = await AlbumDAO.delete(req.params.id);
  if (result) res.json(sucess(result));
  else res.status(500).json(fail("Album não encontrado"));
});

module.exports = router;
