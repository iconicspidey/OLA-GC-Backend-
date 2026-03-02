/* eslint-disable */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reg_no: {
        type: Sequelize.STRING(100),
        allowNull: false,
        notEmpty: true
      },
      class: {
        type: Sequelize.STRING(100),
        allowNull: false,
        notEmpty: true
      },
      reg_no_class: {
        type: Sequelize.STRING(150),
        unique: true,
        allowNull: false,
        notEmpty: true
      },
      results: {
        type: Sequelize.TEXT,
        defaultValue: ''
      },
      scores: {
        type: Sequelize.TEXT,
        defaultValue: ''
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
  down: async (queryInterface /* , Sequelize */) => {
    await queryInterface.dropTable('Results');
  }
};
