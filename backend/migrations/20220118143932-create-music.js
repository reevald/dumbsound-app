'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('music', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.STRING
      },
      thumbnail: {
        type: Sequelize.TEXT
      },
      attache: {
        type: Sequelize.TEXT
      },
      artisId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "artis",
          key: "id",
          as: "artisId"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('music');
  }
};