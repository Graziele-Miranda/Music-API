const { DataTypes, Op } = require("sequelize");
const sequelize = require("../helpers/connection");
const Album = require("./Album");
const Artist = require("./Artist");

const MusicModel = sequelize.define("Music", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: DataTypes.STRING,
  duracao: DataTypes.STRING,
});

MusicModel.belongsTo(Artist.Model, {
  foreignKey: "artista",
});
Artist.Model.hasMany(MusicModel, { foreignKey: "artista" });

MusicModel.belongsTo(Album.Model, {
  foreignKey: "album",
});
Album.Model.hasMany(MusicModel, { foreignKey: "album" });

module.exports = {
  list: async function () {
    const songs = await MusicModel.findAll({
      include: [Artist.Model, Album.Model],
    });
    return songs;
  },
  //titulo, artista, album, duracao
  save: async function (titulo, artista, album, duracao) {
    if (artista instanceof Artist.Model && album instanceof Album.Model) {
      artista = artista.id;
      album = album.id;
    } else if (typeof artista === "string" && typeof album == "string") {
      obj = await Artist.getByName(artista);
      obj = await Album.getByName(album);
      console.log(obj);
      if (!obj) {
        return null;
      }
      artista = obj.id;
      album = obj.id;
    }

    const music = await MusicModel.create({
      titulo: titulo,
      artista: artista,
      album: album,
      duracao: duracao,
    });
    return music;
  },

  update: async function (id, obj) {
    let music = await MusicModel.findByPk(id);
    if (!music) {
      return false;
    }

    Object.keys(obj).forEach((key) => (music[key] = obj[key]));
    await music.save();
    return music;
  },

  delete: async function (id) {
    const music = await MusicModel.findByPk(id);
    return music.destroy();
  },

  getById: async function (id) {
    return await MusicModel.findByPk(id);
  },

  getByName: async function (titulo) {
    return await MusicModel.findOne({
      where: {
        titulo: {
          [Op.like]: "%" + titulo + "%",
        },
      },
    });
  },

  Model: MusicModel,
};
