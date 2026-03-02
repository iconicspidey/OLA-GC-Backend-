/* eslint-disable */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Timers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      class: {
        type: Sequelize.STRING(100),
        allowNull: false,
        notEmpty: true
      },
      subject: {
        type: Sequelize.STRING(100),
        allowNull: false,
        notEmpty: true
      },
      class_subject: {
        type: Sequelize.STRING(150),
        unique: true,
        allowNull: false,
        notEmpty: true
      },
      stop_time: {
        allowNull: false,
        type: Sequelize.DATE,
        notEmpty: true
      },
      arm: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Timers');
  }
};
