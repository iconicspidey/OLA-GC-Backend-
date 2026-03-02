const MSG = require('../../helpers/messages');
const classes = require('../../../constants');

module.exports = (sequelize, DataTypes) => {
  const Results = sequelize.define('Results', {
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        isIn: {
          args: [Object.keys(classes)],
          msg: MSG.ERROR.INVALID_CLASS_SELECTION
        },
        len: {
          args: [3, 100],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for class`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for class`
        }
      }
    },
    reg_no: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 20],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for student admission number`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for student admission number`
        }
      }
    },
    reg_no_class: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 20],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for student admission number`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for student admission number`
        }
      }
    },
    results: {
      type: DataTypes.TEXT
    }
  });
  return Results;
};
