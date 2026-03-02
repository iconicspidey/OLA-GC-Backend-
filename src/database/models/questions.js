// 'use strict'
const MSG = require('../../helpers/messages');
const classes = require('../../../constants');

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Questions', {
    class: {
      type: DataTypes.STRING,
      allowNull: false,
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
    instruction_before: {
      type: DataTypes.TEXT
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 4,
          msg: `${MSG.ERROR.LESS_CHARACTERS} for question`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for question`
        }
      }
    },
    optiona: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 4,
          msg: `${MSG.ERROR.LESS_CHARACTERS} for Option A`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for Option A`
        }
      }
    },
    optionb: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 4,
          msg: `${MSG.ERROR.LESS_CHARACTERS} for Option B`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for Option B`
        }
      }
    },
    optionc: {
      type: DataTypes.TEXT
    },
    optiond: {
      type: DataTypes.TEXT
    },
    optione: {
      type: DataTypes.TEXT
    },
    correct_answer: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isIn: {
          args: [['a', 'b', 'c', 'd', 'e', 'A', 'B', 'C', 'D', 'E']],
          msg: MSG.ERROR.INVALID_OPTION_SELECTION
        }
      }
    },
    marks: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: `${MSG.ERROR.NOT_A_NUMBER} for value of marks`
        }
      }
    }
  });
  return Question;
};
