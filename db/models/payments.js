'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.cadastro, { foreignKey: 'users_ids' });
    }
  }
  payments.init({
    subtotal: DataTypes.DECIMAL,
    freight: DataTypes.DECIMAL,
    discount: DataTypes.DECIMAL,
    total: DataTypes.DECIMAL,
    users_ids: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'payments',
  });
  return payments;
};