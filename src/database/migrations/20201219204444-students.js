/* eslint-disable */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        notEmpty: true
      },
      reg_no: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
        notEmpty: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
        defaultValue: '000000'
      },
      class: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      arm: {
        type: Sequelize.STRING
      },
      take_exams: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        notEmpty: true,
        defaultValue: false
      },
      result: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Students');
  }
};
