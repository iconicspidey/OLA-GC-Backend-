/* eslint-disable */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Adminlogins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
        notEmpty: true
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        notEmpty: true
      },
      full_name: {
        type: Sequelize.STRING
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
      role: {
        type: Sequelize.STRING(50),
        defaultValue: 'teacher'
      },
      token: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: true
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
    await queryInterface.dropTable('Adminlogin');
  }
};
