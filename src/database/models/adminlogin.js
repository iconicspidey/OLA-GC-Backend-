const passwordHash = require('password-hash');
const MSG = require('../../helpers/messages');
const classes = require('../../../constants');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Adminlogin', {
    username: {
      type: DataTypes.STRING(100), // eslint-disable-line
      unique: true,
      allowNull: false,
      notEmpty: false,
      validate: {
        len: {
          args: [3, 15],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for username`
        },
        notNull: {
          msg: MSG.ERROR.EMPTY_USERNAME
        }
      }
    },
    full_name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 15],
          msg: MSG.ERROR.INVALID_PASSWORD_LENGTH
        },
        notNull: {
          msg: MSG.ERROR.INVALID_PASSWORD
        }
      }
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for teacher class`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for teacher class`
        },
        isIn: {
          args: [Object.keys(classes)],
          msg: MSG.ERROR.INVALID_CLASS_SELECTION
        }
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: `${MSG.ERROR.LESS_CHARACTERS} for teachers subject`
        },
        notNull: {
          msg: `${MSG.ERROR.INPUT_INVALID} for teachers subject`
        }
      }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: `${new Date().getTime()}_${Math.random().toString(36).slice(2)}`
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: (admin) => {
        admin.password = passwordHash.generate(admin.password);
      }
    }
  });
  return Admin;
};
