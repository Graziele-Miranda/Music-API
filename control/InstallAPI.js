const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/connection");

const AlbumModel = require("../model/Album");
const ArtistModel = require("../model/Artist");
const MusicModel = require("../model/Music");
const UserModel = require("../model/User");

router.get("/", async (req, res) => {
  await sequelize.sync({ force: true });

  let user = await UserModel.save(
    "grazielemiranda",
    "Graziele Miranda",
    "graziele@email.com",
    "1234",
    true
  );

  usuariolista = [user];

  artistList = [
    await ArtistModel.save(
      "Black Sabbath",
      "Heavy Metal",
      "Reino Unido",
      "Black Sabbath é uma icônica banda britânica de heavy metal formada em 1968. Eles são considerados pioneiros do gênero e tiveram um grande impacto na música. Com sua sonoridade pesada e letras sombrias, lançaram álbuns clássicos como 'Black Sabbath', 'Paranoid' e 'Sabbath Bloody Sabbath'. Apesar de mudanças na formação e desafios pessoais, o Black Sabbath deixou um legado duradouro na música e é uma das bandas mais influentes do rock e do heavy metal."
    ),
    await ArtistModel.save(
      "Amy Winehouse",
      "Soul",
      "Reino Unido",
      "Amy Winehouse foi uma cantora britânica de talento excepcional, conhecida por sua voz poderosa e estilo único. Ela alcançou fama internacional com o álbum 'Back to Black' e seus sucessos como 'Rehab'."
    ),
    await ArtistModel.save(
      "Michael Jackson",
      "Pop",
      "Estados Unidos",
      "Michael Jackson foi um cantor, compositor e dançarino norte-americano, considerado o Rei do Pop..."
    ),
    await ArtistModel.save(
      "Pink Floyd",
      "Rock Progressivo",
      "Reino Unido",

      "Pink Floyd é uma banda de rock britânica famosa por suas composições complexas e performances ao vivo..."
    ),
    await ArtistModel.save(
      "Nina Simone",
      "Jazz",
      "Estados Unidos",
      "Nina Simone foi uma cantora, compositora e ativista norte-americana que se destacou no cenário do jazz..."
    ),
  ];

  albumsList = [
    await AlbumModel.save(
      "Master of Reality",
      artistList[0].id,
      1971,
      "Heavy Metal"
    ),
    await AlbumModel.save("Back to Black", artistList[1].id, 2006, "Soul"),
    await AlbumModel.save("Thriller", artistList[2].id, 1982, "Pop"),
    await AlbumModel.save(
      "The Dark Side of the Moon",
      artistList[3].id,
      1973,
      "Progressive rock"
    ),
  ];

  //Adicionar musicas
  musicList = [
    await MusicModel.save(
      "Wanna Be Startin' Somethin'",
      artistList[2].id,
      albumsList[2].id,
      "00:06:03"
    ),
    await MusicModel.save(
      "Baby Be Mine",
      artistList[2].id,
      albumsList[2].id,
      "00:04:20"
    ),

    await MusicModel.save(
      "The Girl Is Mine",
      artistList[2].id,
      albumsList[2].id,
      "00:03:42"
    ),
    await MusicModel.save(
      "Thriller",
      artistList[2].id,
      albumsList[2].id,
      "00:05:57"
    ),
    await MusicModel.save(
      "Beat It",
      artistList[2].id,
      albumsList[2].id,
      "00:04:18"
    ),

    await MusicModel.save(
      "Billie Jean",
      artistList[2].id,
      albumsList[2].id,
      "00:04:54"
    ),

    await MusicModel.save(
      "Human Nature",
      artistList[2].id,
      albumsList[2].id,
      "00:04:06"
    ),

    await MusicModel.save(
      "P.Y.T. (Pretty Young Thing)",
      artistList[2].id,
      albumsList[2].id,
      "00:03:59"
    ),

    await MusicModel.save(
      "The Lady in My Life",
      artistList[2].id,
      albumsList[2].id,
      "00:04:58"
    ),
  ];

  res.json({
    status: true,
    albums: albumsList,
    artists: artistList,
    songs: musicList,
    user: usuariolista,
  });
});

module.exports = router;
