'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mappedData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  mappedData.init({
    Customer_ID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    Customer_Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Customer_Email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Customer_Phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Product_ID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Product_Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Product_Amount: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'mappedData',
  });
  return mappedData;
};