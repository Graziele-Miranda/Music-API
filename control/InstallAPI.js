const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/connection");

const AlbumModel = require("../model/Album");
const ArtistModel = require("../model/Artist");
const MusicModel = require("../model/Music");
const UserModel = require("../model/User");

router.get("/", async (req, res) => {
  await sequelize.sync({ force: true });

  userlist = [
    await UserModel.save(
      "grazielemiranda",
      "Graziele Miranda",
      "graziele@email.com",
      "1234",
      true
    ),
  ];

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
      "Michael Jackson foi um renomado cantor, compositor, dançarino e produtor musical. Ele alcançou fama mundial como membro do grupo Jackson 5 e, posteriormente, como artista solo. Seu álbum 'Thriller' é o mais vendido de todos os tempos. Jackson era conhecido por sua música inovadora, danças icônicas e videoclipes revolucionários. Ele também apoiou causas humanitárias. Apesar das controvérsias e dificuldades pessoais, seu legado musical é duradouro e ele é considerado um dos maiores artistas da história da música."
    ),
    await ArtistModel.save(
      "Pink Floyd",
      "Rock Progressivo",
      "Reino Unido",
      "Pink Floyd foi uma icônica banda de rock progressivo formada em Londres, no ano de 1965. Com uma combinação única de letras introspectivas, experimentações sonoras e espetáculos visuais impressionantes, eles se tornaram uma das bandas mais influentes e bem-sucedidas da história da música. Álbuns como 'The Dark Side of the Moon' e 'The Wall' são considerados obras-primas, abordando temas como alienação, guerra e a condição humana. Mesmo após várias mudanças na formação, o legado da Pink Floyd continua a inspirar e cativar fãs ao redor do mundo."
    ),
    await ArtistModel.save(
      "Aretha Franklin",
      "Soul",
      "Estados Unidos",
      "Aretha Franklin foi uma cantora e compositora norte-americana, conhecida como a 'Rainha do Soul'. Nascida em 1942 em Memphis, Tennessee, ela começou sua carreira na música gospel antes de alcançar sucesso no cenário mainstream. Com sua poderosa voz e interpretações emotivas, Franklin se destacou como uma das maiores vocalistas de todos os tempos. Hits como 'Respect', 'Natural Woman' e 'I Say a Little Prayer' se tornaram hinos da música soul. Franklin recebeu inúmeros prêmios e honrarias ao longo de sua carreira, e seu legado continua a influenciar gerações de artistas."
    ),
    await ArtistModel.save(
      "Novos Baianos",
      "MPB",
      "Brasil",
      "Os Novos Baianos foram uma banda brasileira formada na década de 1960. Originários da Bahia, o grupo mesclou influências de diferentes gêneros musicais, como MPB, rock, samba e música nordestina, criando um som único e inovador. Com suas composições e performances vibrantes, os Novos Baianos se destacaram pela energia contagiante de suas músicas. Seus álbuns, como 'Acabou Chorare', é considerado um clássico da música brasileira. O grupo teve um importante papel na cena musical brasileira, influenciando diversas gerações de artistas."
    ),
    await ArtistModel.save(
      "System of a Down",
      "Metal Progressivo",
      "Estados Unidos",
      "System of a Down é uma banda de rock norte-americana formada em 1994. Conhecida por sua música intensa e letras politicamente engajadas, a banda mescla elementos de metal, rock alternativo e música étnica em seu som. Hits como 'Chop Suey!', 'Toxicity' e 'B.Y.O.B.' os catapultaram para o sucesso mundial. Com sua abordagem única e cativante, o System of a Down se tornou uma das bandas mais influentes e populares do gênero. Apesar de pausas na carreira, eles continuam a ser aclamados e adorados por fãs em todo o mundo."
    ),
    await ArtistModel.save(
      "Jorge Ben Jor",
      "MPB",
      "Brasil",
      "Jorge Ben Jor, também conhecido como Jorge Ben, é um renomado cantor, compositor e guitarrista brasileiro. Nascido em 1942, no Rio de Janeiro, ele é considerado um dos artistas mais influentes da música brasileira. Sua música é uma fusão de diferentes estilos, como samba, funk, rock e ritmos afro-brasileiros. Hits como 'Mas Que Nada', 'Taj Mahal' e 'País Tropical' o tornaram um ícone da música brasileira. "
    ),
    await ArtistModel.save(
      "Belchior",
      "MPB",
      "Brasil",
      "Belchior, cujo nome real era Antônio Carlos Belchior, foi um cantor, compositor e poeta brasileiro. Nascido em 1946, na cidade de Sobral, Ceará, ele se destacou por suas letras profundas e poéticas, abordando temas como amor, política, desigualdade social e existencialismo. Sua música era uma mistura de MPB, folk e rock, com influências da cultura nordestina. Sucessos como 'Apenas um Rapaz Latino-Americano' e 'Como Nossos Pais' se tornaram hinos de uma geração. Belchior deixou um legado artístico significativo, sendo reconhecido como um dos grandes compositores da música brasileira. Sua obra continua a inspirar e emocionar ouvintes até os dias de hoje."
    ),
    await ArtistModel.save(
      "The Rolling Stones",
      "Rock",
      "Reino Unido",
      "A Rolling Stones é uma banda de rock britânica formada em 1962, em Londres. Composta por Mick Jagger (vocal), Keith Richards (guitarra), Charlie Watts (bateria) e Ronnie Wood (guitarra), a banda se tornou uma das mais influentes e duradouras da história do rock. Seu som distinto, enraizado no blues e no rock and roll, combinado com as performances carismáticas de Jagger, conquistou milhões de fãs ao redor do mundo. Hits como 'Satisfaction', 'Paint It Black' e 'Start Me Up' são apenas algumas das canções que definiram a carreira dos Rolling Stones. Com mais de cinco décadas de carreira, eles continuam a fazer turnês e lançar novas músicas, deixando um legado duradouro na música rock."
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
    await AlbumModel.save(
      "I Never Loved a Man The Way I Love You",
      artistList[4].id,
      1967,
      "Soul"
    ),
    await AlbumModel.save("Acabou Chorare", artistList[5].id, 1972, "MPB"),
    await AlbumModel.save(
      "Toxicity",
      artistList[6].id,
      2001,
      "Metal Progressivo"
    ),
    await AlbumModel.save("Tábua de Esmeralda", artistList[7].id, 1974, "MPB"),
    await AlbumModel.save("Alucinação", artistList[8].id, 1976, "MPB"),
    await AlbumModel.save("Exile On Main St.", artistList[9].id, 1972, "Rock"),
  ];

  //Adicionar musicas
  musicList = [
    //Black Sabbath
    await MusicModel.save(
      "Sweet Leaf",
      artistList[0].id,
      albumsList[0].id,
      "5:05"
    ),
    await MusicModel.save(
      "After Forever",
      artistList[0].id,
      albumsList[0].id,
      "5:27"
    ),
    await MusicModel.save(
      "Embryo (Instrumental)",
      artistList[0].id,
      albumsList[0].id,
      " 0:28"
    ),
    await MusicModel.save(
      "Children of the Grave",
      artistList[0].id,
      albumsList[0].id,
      "5:17"
    ),
    await MusicModel.save(
      "Orchid (Instrumental)",
      artistList[0].id,
      albumsList[0].id,
      "1:31"
    ),
    await MusicModel.save(
      "Lord of This World",
      artistList[0].id,
      albumsList[0].id,
      "5:24"
    ),
    await MusicModel.save(
      "Solitude",
      artistList[0].id,
      albumsList[0].id,
      "5:02"
    ),
    await MusicModel.save(
      "Into the Void",
      artistList[0].id,
      albumsList[0].id,
      "6:12"
    ),
    //Novos Baianos
    await MusicModel.save(
      "Brasil Pandeiro",
      artistList[5].id,
      albumsList[5].id,
      "4:19"
    ),
    await MusicModel.save(
      "Preta Pretinha",
      artistList[5].id,
      albumsList[5].id,
      "5:00"
    ),
    await MusicModel.save(
      "Tinindo Trincando",
      artistList[5].id,
      albumsList[5].id,
      "3:04"
    ),
    await MusicModel.save(
      "Swing de Campo Grande",
      artistList[5].id,
      albumsList[5].id,
      "3:41"
    ),
    await MusicModel.save(
      "Acabou Chorare",
      artistList[5].id,
      albumsList[5].id,
      "3:54"
    ),
    await MusicModel.save(
      "Mistério do Planeta",
      artistList[5].id,
      albumsList[5].id,
      "3:50"
    ),
    await MusicModel.save(
      "A Menina Dança",
      artistList[5].id,
      albumsList[5].id,
      "3:09"
    ),
    await MusicModel.save(
      "Besta é Tu",
      artistList[5].id,
      albumsList[5].id,
      "3:27"
    ),
    await MusicModel.save(
      "Um Bilhete Pra Didi",
      artistList[5].id,
      albumsList[5].id,
      "4:18"
    ),
    await MusicModel.save(
      "Preta Pretinha (Ao Vivo)",
      artistList[5].id,
      albumsList[5].id,
      "5:07"
    ),
    //Michael Jackson
    await MusicModel.save(
      "Wanna Be Startin' Somethin",
      artistList[2].id,
      albumsList[2].id,
      "06:03"
    ),
    await MusicModel.save(
      "Baby Be Mine",
      artistList[2].id,
      albumsList[2].id,
      "04:20"
    ),

    await MusicModel.save(
      "The Girl Is Mine",
      artistList[2].id,
      albumsList[2].id,
      "03:42"
    ),
    await MusicModel.save(
      "Thriller",
      artistList[2].id,
      albumsList[2].id,
      "05:57"
    ),
    await MusicModel.save(
      "Beat It",
      artistList[2].id,
      albumsList[2].id,
      "04:18"
    ),

    await MusicModel.save(
      "Billie Jean",
      artistList[2].id,
      albumsList[2].id,
      "04:54"
    ),

    await MusicModel.save(
      "Human Nature",
      artistList[2].id,
      albumsList[2].id,
      "04:06"
    ),

    await MusicModel.save(
      "P.Y.T. (Pretty Young Thing)",
      artistList[2].id,
      albumsList[2].id,
      "03:59"
    ),

    await MusicModel.save(
      "The Lady in My Life",
      artistList[2].id,
      albumsList[2].id,
      "04:58"
    ),
  ];

  res.json({
    status: true,
    albums: albumsList,
    artists: artistList,
    songs: musicList,
    user: userlist,
  });
});

module.exports = router;
