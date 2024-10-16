'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cadastro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.comments, { foreignKey: 'userId' });
      this.hasMany(models.products, { foreignKey: 'usersId' });
      this.hasMany(models.payments, { foreignKey: 'users_ids' });
    }
  }
  cadastro.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cadastro',
  });
  return cadastro;
};