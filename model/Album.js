const { DataTypes, Op } = require("sequelize");
const sequelize = require("../helpers/connection");
const Artist = require("./Artist");

const AlbumModel = sequelize.define("Album", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: DataTypes.STRING,
  ano: DataTypes.INTEGER,
  genero: DataTypes.STRING,
});

AlbumModel.belongsTo(Artist.Model, {
  foreignKey: "artista",
});
Artist.Model.hasMany(AlbumModel, { foreignKey: "artista" });

module.exports = {
  list: async function () {
    const albums = await AlbumModel.findAll({ include: Artist.Model });
    return albums;
  },

  save: async function (titulo, artista, ano, genero) {
    if (artista instanceof Artist.Model) {
      artista = artista.id;
    } else if (typeof artista === "string") {
      obj = await Artist.getByName(artista);
      console.log(obj);
      if (!obj) {
        return null;
      }
      artista = obj.id;
    }

    const album = await AlbumModel.create({
      titulo: titulo,
      artista: artista,
      ano: ano,
      genero: genero,
    });
    return album;
  },

  update: async function (id, obj) {
    let album = await AlbumModel.findByPk(id);
    if (!album) {
      return false;
    }

    Object.keys(obj).forEach((key) => (album[key] = obj[key]));
    await album.save();
    return album;
  },

  delete: async function (id) {
    const album = await AlbumModel.findByPk(id);
    return album.destroy();
  },

  getById: async function (id) {
    return await AlbumModel.findByPk(id);
  },

  getByName: async function (titulo) {
    return await AlbumModel.findOne({
      where: {
        titulo: {
          [Op.like]: "%" + titulo + "%",
        },
      },
    });
  },

  Model: AlbumModel,
};
