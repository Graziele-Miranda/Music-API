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

  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [2, 50],
        msg: "O título deve ter entre 2 à 50 caracteres",
      },
    },
    duracao: DataTypes.STRING,
  },
});

MusicModel.belongsTo(Artist.Model, {
  foreignKey: "artista",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Artist.Model.hasMany(MusicModel, {
  foreignKey: "artista",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
MusicModel.belongsTo(Album.Model, {
  foreignKey: "album",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Album.Model.hasMany(MusicModel, { foreignKey: "album", onDelete: "CASCADE" });
module.exports = {
  list: async function (limite, pagina) {
    const offset = (pagina - 1) * limite;
    const songs = await MusicModel.findAll({
      include: [Artist.Model, Album.Model],
      limit: limite,
      offset: offset,
      order: [["id", "ASC"]],
    });
    return songs;
  },

  save: async function (titulo, artista, album, duracao) {
    if (artista instanceof Artist.Model && album instanceof Album.Model) {
      artista = artista.id;
      album = album.id;
    } else if (typeof artista === "string" && typeof album == "string") {
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
    return await MusicModel.destroy({ where: { id: id } });
  },

  getById: async function (id) {
    return await MusicModel.findByPk(id);
  },

  getAlbumMusic: async function (id, limite, pagina) {
    const offset = (pagina - 1) * limite;
    return await MusicModel.findAll({
      where: {
        album: id,
      },
      include: [Artist.Model, Album.Model],
      limit: limite,
      offset: offset,
      order: [["id", "ASC"]],
    });
  },

  getByName: async function (titulo) {
    return await MusicModel.findOne({
      where: {
        titulo: {
          [Op.eq]: titulo,
        },
      },
    });
  },

  Model: MusicModel,
};
