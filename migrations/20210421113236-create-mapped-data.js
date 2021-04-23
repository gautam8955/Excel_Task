'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mappedData', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   type: Sequelize.INTEGER
      // },
      Customer_ID: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      Customer_Name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Customer_Email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Customer_Phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Product_ID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Product_Name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Product_Amount: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {    
    await queryInterface.dropTable('mappedData');
  }
};