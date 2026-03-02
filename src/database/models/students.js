const MSG = require('../../helpers/messages');
const classes = require('../../../constants');

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Students', {
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
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 200],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for student name`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for student name`
        }
      }
    },
    reg_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'A student with same admission number already exist'
      },
      validate: {
        len: {
          args: 4,
          msg: `${MSG.ERROR.LESS_CHARACTERS} for student admission number`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for student admission number`
        }
      }
    },
    arm: {
      type: DataTypes.STRING,
      allowNull: true,
      default: null
    }
  });
  return Student;
};
