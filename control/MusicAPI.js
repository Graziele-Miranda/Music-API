const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const MusicDAO = require("../model/Music");

router.get("/", async (req, res) => {
  let musics = await MusicDAO.list();
  res.json(sucess(musics, "list"));
});

router.get("/:id", async (req, res) => {
  let obj = await MusicDAO.getById(req.params.id);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Não foi possível localizar a musica"));
});

router.post("/", async (req, res) => {
  const { titulo, artista, album, duracao } = req.body;
  //TODO validar os campos

  let obj = await MusicDAO.save(titulo, artista, album, duracao);
  if (obj) res.json(sucess(obj));
  else res.status(500).json(fail("Falha ao salvar a nova msuica"));
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, artista, album, duracao } = req.body;

  //TODO validar os campos

  let [result] = await MusicDAO.update(id, titulo, artista, album, duracao);
  console.log(result);
  if (result) res.json(sucess(result));
  else res.status(500).json(fail("Falha ao alterar o musica"));
});

router.delete("/:id", async (req, res) => {
  let result = await MusicDAO.delete(req.params.id);
  if (result) res.json(sucess(result));
  else res.status(500).json(fail("Musica não encontrada"));
});

module.exports = router;
