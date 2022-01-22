'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE"
      });
    }
  }
  payment.init({
    startDate: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    attache: DataTypes.TEXT,
    status: DataTypes.STRING,
    accountNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};