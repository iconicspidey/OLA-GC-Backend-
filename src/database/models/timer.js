const MSG = require('../../helpers/messages');
const classes = require('../../../constants');

module.exports = (sequelize, DataTypes) => {
  const Timer = sequelize.define('Timers', {
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.keys(classes)],
          msg: MSG.ERROR.INVALID_CLASS_SELECTION
        },
        len: {
          args: [2, 100],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for class`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for class`
        }
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 200],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for subject`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for subject`
        }
      }
    },
    stop_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        len: {
          args: 4,
          msg: `${MSG.ERROR.LESS_CHARACTERS} for stop time`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for stop time`
        }
      }
    },
    arm: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    class_subject: {
      type: DataTypes.STRING,
      unique: true
    }
  });
  return Timer;
};
