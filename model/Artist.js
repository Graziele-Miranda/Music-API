const { DataTypes, Op } = require("sequelize");
const sequelize = require("../helpers/connection");

const ArtistModel = sequelize.define("Artist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paisOrigem: DataTypes.STRING,
  biografia: DataTypes.TEXT,
});

module.exports = {
  list: async function (limite, pagina) {
    const offset = (pagina - 1) * limite;
    const artist = await ArtistModel.findAll({
      limit: limite,
      offset: offset,
      order: [["id", "ASC"]],
    });
    return artist;
  },
  //Colunas: ID, Nome, Gênero, País de origem, Biografia.
  save: async function (nome, genero, paisOrigem, biografia) {
    const artists = await ArtistModel.create({
      nome: nome,
      genero: genero,
      paisOrigem: paisOrigem,
      biografia: biografia,
    });

    return artists;
  },
  update: async function (id, obj) {
    let artist = await ArtistModel.findByPk(id);
    if (!artist) {
      return false;
    }

    Object.keys(obj).forEach((key) => (artist[key] = obj[key]));
    await artist.save();
    return artist;
  },
  delete: async function (id) {
    return await ArtistModel.destroy({ where: { id: id } });
  },

  getById: async function (id) {
    return await ArtistModel.findByPk(id);
  },

  getByName: async function (nome) {
    return await ArtistModel.findOne({
      where: {
        nome: {
          [Op.eq]: nome,
        },
      },
    });
  },

  Model: ArtistModel,
};
