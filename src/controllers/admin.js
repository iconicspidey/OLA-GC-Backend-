const passwordHash = require("password-hash");
const { Adminlogin, sequelize } = require("../database/models");
const MSG = require("../helpers/messages");
const isAuth = require("./authController").isAuthenticatedRequest;
const classes = require("../../constants");

module.exports = {
  async login(req, res) {
    // log staff and return token
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Username or password missing`,
      });
    }
    return Adminlogin.findOne({ where: { username: req.body.username } })
      .then((result) => {
        if (result && result.password && passwordHash.verify(req.body.password, result.password)) {
          return res.status(200).send({
            errored: false,
            message: { token: result.token, role: result.role },
          });
        }
        // login not successful
        return res.status(200).send({
          errored: true,
          message: MSG.ERROR.WRONG_LOGIN,
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.ERROR_LOGGING_IN,
        });
      });
  },
  async single(req, res) {
    // teacher single insert
    if ((await isAuth(req.body, req.cookies.admin_token)) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }
    return Adminlogin.create({
      username: req.body.username,
      password: req.body.password,
      full_name: req.body.full_name,
      class: req.body.class || "JS1",
      subject: req.body.subject || "NO_SUBJECT",
      role: req.body.role,
      token: `${new Date().getTime()}_${Math.random().toString(36).slice(2)}${Math.floor(
        Math.random() * 100
      )}_`,
    })
      .then(() => {
        res.status(201).send({
          errored: false,
          message: MSG.SUCCESS.STAFF_CREATED,
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.STAFF_CREATE_FAILED,
        });
      });
  },
  async bulk(req, res) {
    // bulk upload of teachers
    if ((await isAuth(req.body, req.cookies.admin_token)) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }
    if (!req.body[0] || !req.body[0].username) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.BAD_REQUEST });
    }
    // if all is well
    return Adminlogin.bulkCreate(req.body, {
      fields: ["username", "class", "full_name", "role", "subject"],
      ignoreDuplicates: true,
      validate: true,
      // updateOnDuplicate: ['reg_no']
    })
      .then(() => {
        res.status(201).send({
          errored: false,
          message: MSG.SUCCESS.STUDENT_UPLOAD_SUCCESS,
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.STUDENT_UPLOAD_FAIL,
        });
      });
  },
  async update(req, res) {
    // Update single staff data
    if ((await isAuth(req.body, req.cookies.admin_token)) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }
    if (!req.params.id || !req.body || req.body.id || typeof req.body !== "object") {
      return res.status(401).send({
        errored: true,
        message: MSG.ERROR.INPUT_INVALID,
      });
    }
    let query = "";
    query += req.body.password ? `password = '${passwordHash.generate(req.body.password)}' ` : "";
    for (const [key, value] of Object.entries(req.body)) {
      // eslint-disable-line
      if (key !== "password")
        query += query.length > 1 ? `, ${key} = '${value}' ` : ` ${key} = '${value}'`;
      // query += (query.length > 1) ? `, ${key} = '${value}' ` : ` ${key} = '${value}'`;
    }
    query =
      query.length > 1
        ? `UPDATE Adminlogins SET ${query} WHERE id = ${req.params.id} AND ${req.params.id} <> 1`
        : "";

    return sequelize
      .query(query)
      .then((rslt) => {
        res.status(200).send({
          errored: rslt[0].affectedRows < 1,
          message:
            rslt[0].affectedRows < 1 ? MSG.ERROR.RECORD_UPDATE_FAILED : MSG.SUCCESS.RECORD_UPDATED,
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.RECORD_UPDATE_FAILED,
        });
      });
  },
  async changeSuperAdminData(req, res) {
    // Update single staff data
    if ((await isAuth(req.body, req.cookies.admin_token)) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }

    if (!req.body || req.body.id || typeof req.body !== "object") {
      return res.status(401).send({
        errored: true,
        message: MSG.ERROR.INPUT_INVALID,
      });
    }
    let query = "";
    query += req.body.password ? `password = '${passwordHash.generate(req.body.password)}' ` : "";
    for (const [key, value] of Object.entries(req.body)) {
      // eslint-disable-line
      if (key !== "password")
        query += query.length > 1 ? `, ${key} = '${value}' ` : ` ${key} = '${value}'`;
    }
    query =
      query.length > 1
        ? `UPDATE Adminlogins SET ${query} WHERE id = 1 AND token = '${req.cookies.admin_token}'`
        : "";

    return sequelize
      .query(query)
      .then((rslt) => {
        res.status(200).send({
          errored: rslt[0].affectedRows < 1,
          message:
            rslt[0].affectedRows < 1 ? MSG.ERROR.RECORD_UPDATE_FAILED : MSG.SUCCESS.RECORD_UPDATED,
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.RECORD_UPDATE_FAILED,
        });
      });
  },
  async remove(req, res) {
    // Update single staff data
    if ((await isAuth(req.body, req.cookies.admin_token)) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }
    if (!req.params.id || req.params.id === "1") {
      return res.status(401).send({
        errored: true,
        message: MSG.ERROR.INPUT_INVALID,
      });
    }
    return Adminlogin.destroy({ where: { id: req.params.id } })
      .then((deleteStatus) => {
        res.status(200).send({
          errored: deleteStatus <= 0,
          message: deleteStatus <= 0 ? MSG.ERROR.DELETE_UNSUCCESSFUL : MSG.SUCCESS.DELETE_SUCCESS,
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.DELETE_UNSUCCESSFUL,
        });
      });
  },
  async getsingle(req, res) {
    // fetch single staff
    if ((await isAuth(req.body, req.cookies.admin_token)) === false || req.params.id === "1") {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }
    // search by id or username only
    if (!req.params.id && !req.body.username) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.INPUT_INVALID });
    }

    let columns = { id: 0 };
    if (req.params.id) columns = req.params;
    if (Object.keys(req.body).length >= 1) columns = req.body;

    return Adminlogin.findOne({ where: columns })
      .then((result) => {
        res.status(200).send({
          errored: !(result && result.id),
          message: !(result && result.id) ? MSG.ERROR.RECORD_NOT_FOUND : result,
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND,
        });
      });
  },
  async getmultiple(req, res) {
    // fetch multiple staff records; criteria may come from query string (GET) or body (POST)
    if ((await isAuth(req.body, req.cookies.admin_token)) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }

    const criteria = Object.keys(req.query).length > 0 ? req.query : req.body;
    if (Object.keys(criteria).length <= 0) {
      // if no search criteria supplied
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.INPUT_INVALID,
      });
    }

    return Adminlogin.findAll({ where: criteria })
      .then((result) => {
        res.status(200).send({
          errored: !(result && result.length >= 1),
          message: !(result && result.length >= 1) ? MSG.ERROR.RECORD_NOT_FOUND : result,
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND,
        });
      });
  },

  async countTeachers(req, res) {
    // count teacher/admin records, optional filter by role/class
    if ((await isAuth(req.body, req.cookies.admin_token, 'any')) === false) {
      return res.status(400).send({ errored: true, message: MSG.ERROR.UNAUTHORISED_ACCESS });
    }
    const criteria = Object.keys(req.query).length > 0 ? req.query : {};
    return Adminlogin.count({ where: criteria })
      .then((cnt) => {
        res.status(200).send({ errored: false, message: { count: cnt } });
      })
      .catch(() => {
        res.status(400).send({ errored: true, message: MSG.ERROR.INVALID_SEARCH });
      });
  },
  async logout(req, res) {
    // change token
    if ((await isAuth(req.body, req.cookies.admin_token, "any")) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }
    const newToken = `${new Date().getTime()}_${Math.random().toString(36).slice(2)}${Math.floor(
      Math.random() * 100
    )}_L`;
    return sequelize
      .query(
        `UPDATE Adminlogins SET token = '${newToken}' WHERE token = '${req.cookies.admin_token}'`
      )
      .then((rslt) => {
        res.status(200).send({
          errored: rslt[0].affectedRows < 1,
          message: {},
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.LOGOUT_FAILED,
        });
      });
  },
  async self(req, res) {
    // fetch self data
    if (
      (await isAuth(req.body, req.cookies.admin_token, "any")) === false ||
      !req.cookies.admin_token ||
      req.cookies.admin_token.length <= 0
    ) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }

    return Adminlogin.findOne({ where: { token: req.cookies.admin_token } })
      .then((result) => {
        res.status(200).send({
          errored: !(result && result.id),
          message: !(result && result.id) ? {} : result,
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.sqlMessage || MSG.ERROR.RECORD_NOT_FOUND,
        });
      });
  },
  async getclasses(req, res) {
    // get classes and subjects
    if ((await isAuth(req.body, req.cookies.admin_token, "any")) === false) {
      return res.status(403).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS,
      });
    }

    return res.status(200).send({
      errored: false,
      message: classes,
    });
  },
};
