const { DataTypes, Op } = require("sequelize");
const sequelize = require("../helpers/connection");
const Artist = require("./Artist");

const AlbumModel = sequelize.define("Album", {
  visitas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 40],
        msg: "O título deve ter no mínimo 2 caracteres e máximo 40",
      },
    },
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: {
        msg: "O ano deve ser numeral",
      },
    },
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 20],
        msg: "O genero deve ter no mínimo 3 caracteres e máximo 20",
      },
    },
  },
});

AlbumModel.belongsTo(Artist.Model, {
  foreignKey: "artista",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Artist.Model.hasMany(AlbumModel, {
  foreignKey: "artista",
  onUpdate: "CASCADE",
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
  save: async function (titulo, artista, ano, genero, visitas) {
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
      visitas: visitas,
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
  //adicionar um novo campo,onde ao pesquisar  pelo id, ele conta quantas vezes aquele album foi visualizado
  getById: async function (id) {
    const album = await AlbumModel.findByPk(id);
    if (album) {
      album.visitas += 1;
      await album.save();
    }
    return album;
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
  getAlbumsByDecade: async function (decada, limite, pagina) {
    const offset = (pagina - 1) * limite;
    const startYear = decada;
    const endYear = decada + 9;

    return await AlbumModel.findAll({
      include: Artist.Model,
      where: {
        ano: {
          [Op.between]: [startYear, endYear],
        },
      },
      limit: limite,
      offset: offset,
      order: [["ano", "ASC"]],
    });
  },

  Model: AlbumModel,
};
