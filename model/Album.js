const { DataTypes, Op } = require("sequelize");
const sequelize = require("../helpers/connection");
const Artist = require("./Artist");

const AlbumModel = sequelize.define("Album", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

AlbumModel.belongsTo(Artist.Model, {
  foreignKey: "artista",
  onDelete: "CASCADE",
});
Artist.Model.hasMany(AlbumModel, {
  foreignKey: "artista",
  onDelete: "CASCADE",
});

module.exports = {
  list: async function (limite, pagina) {
    const offset = (pagina - 1) * limite;
    const albums = await AlbumModel.findAll({
      include: Artist.Model,
      limit: limite,
      offset: offset,
      order: [["id", "ASC"]],
    });
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
          [Op.eq]: titulo,
        },
      },
    });
  },

  getAlbumsByGenre: async function (genero, limite, pagina) {
    const offset = (pagina - 1) * limite;
    return await AlbumModel.findAll({
      include: Artist.Model,
      where: {
        genero: {
          [Op.like]: "%" + genero + "%",
        },
      },
      limit: limite,
      offset: offset,
      order: [["id", "ASC"]],
    });
  },

  Model: AlbumModel,
};
