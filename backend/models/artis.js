'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class artis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.music, {
        foreignKey: "artisId"
      });
    }
  }
  artis.init({
    name: DataTypes.STRING,
    old: DataTypes.INTEGER,
    type: DataTypes.STRING,
    startCareer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'artis',
  });
  return artis;
};