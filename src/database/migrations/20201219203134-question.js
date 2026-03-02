/* eslint-disable */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
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
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
        notEmpty: true
      },
      optiona: {
        type: Sequelize.TEXT,
        allowNull: false,
        notEmpty: true
      },
      optionb: {
        type: Sequelize.TEXT,
        allowNull: false,
        notEmpty: true
      },
      optionc: {
        type: Sequelize.TEXT
      },
      optiond: {
        type: Sequelize.TEXT
      },
      optione: {
        type: Sequelize.TEXT
      },
      correct_answer: {
        type: Sequelize.STRING(100),
        allowNull: false,
        notEmpty: true
      },
      marks: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      instruction_before: {
        type: Sequelize.TEXT
      },
      last_edit_by: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Questions');
  }
};
