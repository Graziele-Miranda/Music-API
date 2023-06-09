const express = require("express");
const router = express.Router();

const { sucess, fail } = require("../helpers/resposta");
const ArtistDAO = require("../model/Artist");

router.get("/", (req, res) => {
  ArtistDAO.list().then((artists) => {
    res.json(sucess(artists, "list"));
  });
});

router.get("/:id", (req, res) => {
  ArtistDAO.getById(req.params.id)
    .then((artist) => {
      res.json(sucess(artist));
    })
    .catch((err) => {
      consol.elog(err);
      res.status(500).json(fail("Não foi possível localizar o artista"));
    });
});
// ID, Nome, Gênero, País de origem, Biografia.
router.post("/", (req, res) => {
  const { nome, genero, paisOrigem, biografia } = req.body;

  //TODO validar os campos

  ArtistDAO.save(nome, genero, paisOrigem, biografia)
    .then((artist) => {
      res.json(sucess(artist));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Falha ao salvar o novo artista"));
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, genero, paisOrigem, biografia } = req.body;

  //TODO validar os campos
  let obj = {};
  if (nome) obj.nome = nome;
  if (genero) obj.genero = genero;
  if (paisOrigem) obj.paisOrigem = paisOrigem;
  if (biografia) obj.biografia = biografia;

  if (obj == {}) {
    return res.status(500).json(fail("Nenhum atributo foi modificado"));
  }

  ArtistDAO.update(id, obj)
    .then((artist) => {
      if (artist) res.json(sucess(artist));
      else res.status(500).json(fail("Artista não encontrado"));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Falha ao alterar artista"));
    });
});

router.delete("/:id", (req, res) => {
  ArtistDAO.delete(req.params.id)
    .then((artist) => {
      if (artist) res.json(sucess(artist));
      else res.status(500).json(fail("Artista não encontrado"));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(fail("Falha ao excluir o artista"));
    });
});

module.exports = router;
