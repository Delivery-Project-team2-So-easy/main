'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      store_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      store_address: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      store_img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      opening_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      company_resistration_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stores');
  },
};
