const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/connection");

const ArtistModel = sequelize.define("Artist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: DataTypes.STRING,
  genero: DataTypes.STRING,
  paisOrigem: DataTypes.STRING,
  biografia: DataTypes.STRING,
});

module.exports = {
  list: async function () {
    const artists = await ArtistModel.findAll();
    return artists;
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
  update: async function (id, nome, genero, paisOrigem, biografia) {
    return await ArtistModel.update(
      { nome: nome },
      { genero: genero },
      { paisOrigem: paisOrigem },
      { biografia: biografia },
      {
        where: { id: id },
      }
    );
  },
  delete: async function (id) {
    //Precisa fazer algo para os livros que este autor possui
    return await ArtistModel.destroy({ where: { id: id } });
  },

  getById: async function (id) {
    return await ArtistModel.findByPk(id);
  },

  getByName: async function (nome) {
    return await ArtistModel.findOne({
      where: {
        nome: {
          [Op.like]: "%" + nome + "%",
        },
      },
    });
  },

  Model: ArtistModel,
};
