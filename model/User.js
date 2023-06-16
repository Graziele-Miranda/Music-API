const { DataTypes, Op } = require("sequelize");
const sequelize = require("../helpers/connection");

const UserModel = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  administrador: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = {
  list: async function (limite, pagina) {
    const offset = (pagina - 1) * limite;
    const user = await UserModel.findAll({
      limit: limite,
      offset: offset,
      order: [["id", "ASC"]],
    });
    return user;
  },
  save: async function (usuario, nome, email, senha, administrador) {
    const user = await UserModel.create({
      usuario: usuario,
      nome: nome,
      email: email,
      senha: senha,
      administrador: administrador,
    });

    return user;
  },
  update: async function (id, obj) {
    let user = await UserModel.findByPk(id);
    if (!user) {
      return false;
    }

    Object.keys(obj).forEach((key) => (user[key] = obj[key]));
    await user.save();
    return user;
  },
  delete: async function (id) {
    try {
      const deletedUser = await UserModel.destroy({
        where: { id: id, administrador: false },
      });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  },

  getById: async function (id) {
    return await UserModel.findByPk(id);
  },

  getByUser: async function (usuario) {
    return await UserModel.findOne({
      where: {
        usuario: {
          [Op.eq]: usuario,
        },
      },
    });
  },

  getByEmail: async function (email) {
    return await UserModel.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });
  },

  Model: UserModel,
};
