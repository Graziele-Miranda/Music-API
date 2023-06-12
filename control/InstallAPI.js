const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/connection");

const AlbumModel = require("../model/Album");
const ArtistModel = require("../model/Artist");
const MusicModel = require("../model/Music");
const UserModel = require("../model/User");

router.get("/", async (req, res) => {
  await sequelize.sync({ force: true });

  let user1 = await UserModel.save(
    "grazielemiranda",
    "Graziele Miranda",
    "graziele@email.com",
    "1234",
    true
  );

  usuariolista = [user1];

  let artista1 = await ArtistModel.save(
    "Black Sabbath",
    "Heavy Metal",
    "Reino Unido",
    "Black Sabbath é uma icônica banda britânica de heavy metal formada em 1968. Eles são considerados pioneiros do gênero e tiveram um grande impacto na música. Com sua sonoridade pesada e letras sombrias, lançaram álbuns clássicos como 'Black Sabbath', 'Paranoid' e 'Sabbath Bloody Sabbath'. Apesar de mudanças na formação e desafios pessoais, o Black Sabbath deixou um legado duradouro na música e é uma das bandas mais influentes do rock e do heavy metal."
  );

  let artista2 = await ArtistModel.save(
    "Amy Winehouse",
    "Soul",
    "Reino Unido",
    "Amy Winehouse foi uma cantora britânica de talento excepcional, conhecida por sua voz poderosa e estilo único. Ela alcançou fama internacional com o álbum 'Back to Black' e seus sucessos como 'Rehab'."
  );
  let artista3 = await ArtistModel.save(
    "Michael Jackson",
    "Pop",
    "Estados Unidos",
    "Michael Jackson foi um cantor, compositor e dançarino norte-americano, considerado o Rei do Pop..."
  );

  let artista4 = await ArtistModel.save(
    "Pink Floyd",
    "Rock Progressivo",
    "Reino Unido",

    "Pink Floyd é uma banda de rock britânica famosa por suas composições complexas e performances ao vivo..."
  );

  let artista5 = await ArtistModel.save(
    "Nina Simone",
    "Jazz",
    "Estados Unidos",
    "Nina Simone foi uma cantora, compositora e ativista norte-americana que se destacou no cenário do jazz..."
  );

  artistaslista = [artista1, artista2, artista3, artista4, artista5];

  let album1 = await AlbumModel.save(
    "Master of Reality",
    artistaslista[0].id,
    1971,
    "Heavy Metal"
  );
  let album2 = await AlbumModel.save(
    "Back to Black",
    artistaslista[1].id,
    2006,
    "Soul"
  );
  let album3 = await AlbumModel.save(
    "Thriller",
    artistaslista[2].id,
    1982,
    "Pop"
  );
  let album4 = await AlbumModel.save(
    "The Dark Side of the Moon",
    artistaslista[3].id,
    1973,
    "Progressive rock"
  );

  albunslista = [album1, album2, album3, album4];

  //Adicionar musicas
  let music1 = await MusicModel.save(
    "Wanna Be Startin' Somethin'",
    artistaslista[2].id,
    albunslista[2].id,
    "00:06:03"
  );

  let music2 = await MusicModel.save(
    "Baby Be Mine",
    artistaslista[2].id,
    albunslista[2].id,
    "00:04:20"
  );

  let music3 = await MusicModel.save(
    "The Girl Is Mine",
    artistaslista[2].id,
    albunslista[2].id,
    "00:03:42"
  );
  let music4 = await MusicModel.save(
    "Thriller",
    artistaslista[2].id,
    albunslista[2].id,
    "00:05:57"
  );

  let music5 = await MusicModel.save(
    "Beat It",
    artistaslista[2].id,
    albunslista[2].id,
    "00:04:18"
  );

  let music6 = await MusicModel.save(
    "Billie Jean",
    artistaslista[2].id,
    albunslista[2].id,
    "00:04:54"
  );

  let music7 = await MusicModel.save(
    "Human Nature",
    artistaslista[2].id,
    albunslista[2].id,
    "00:04:06"
  );

  let music8 = await MusicModel.save(
    "P.Y.T. (Pretty Young Thing)",
    artistaslista[2].id,
    albunslista[2].id,
    "00:03:59"
  );

  let music9 = await MusicModel.save(
    "The Lady in My Life",
    artistaslista[2].id,
    albunslista[2].id,
    "00:04:58"
  );

  musicaslista = [
    music1,
    music2,
    music3,
    music4,
    music5,
    music6,
    music7,
    music8,
    music9,
  ];

  res.json({
    status: true,
    albums: albunslista,
    artists: artistaslista,
    songs: musicaslista,
    user: usuariolista,
  });
});

module.exports = router;
