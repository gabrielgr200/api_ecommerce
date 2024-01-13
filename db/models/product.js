'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.cadastro, { foreignKey: 'usersId' });
    }
  }
  products.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    image: DataTypes.STRING,
    cadastroId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};