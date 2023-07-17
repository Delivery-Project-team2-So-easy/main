"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Stores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      storeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      storeAddress: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      storeImg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      openingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      companyResistrationNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Stores");
  },
};
