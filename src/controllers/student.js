const { Students } = require('../database/models');
const MSG = require('../helpers/messages');
const isAuth = require('./authController').isAuthenticatedRequest;

module.exports = {
  async single(req, res) {
    // Students single insert
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    return Students
      .create({
        full_name: req.body.full_name,
        reg_no: req.body.reg_no,
        password: req.body.password,
        class: req.body.class,
        arm: req.body.arm || ''
      })
      .then(() => {
        res.status(201).send({
          errored: false,
          message: MSG.SUCCESS.STUDENT_ADDED
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.STUDENT_ADD_FAILED
        });
      });
  },
  async bulk(req, res) {
    // bulk upload of Students
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.body[0] || !req.body[0].reg_no) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.BAD_REQUEST });
    }
    // if all is well
    return Students.bulkCreate(req.body, {
      fields: ['class', 'full_name', 'reg_no', 'arm'],
      ignoreDuplicates: true
      // updateOnDuplicate: ['reg_no']
    })
      .then(() => {
        res.status(201).send({
          errored: false,
          message: MSG.SUCCESS.STUDENT_ADDED
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.STUDENT_ADD_FAILED
        });
      });
  },
  async update(req, res) {
    // Update singl student data
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.params.id || !req.body || req.body.id) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.INPUT_INVALID });
    }
    return Students
      .update(req.body, {
        where: { id: req.params.id }
      })
      .then((rowsAffected) => {
        res.status(200).send({
          errored: (rowsAffected[0] !== 1),
          message: (rowsAffected[0] === 1)
            ? MSG.SUCCESS.RECORD_UPDATED : MSG.ERROR.RECORD_UPDATE_FAILED
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.RECORD_UPDATE_FAILED
        });
      });
  },
  async remove(req, res) {
    // delete single student
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.params.id) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.INPUT_INVALID });
    }
    return Students
      .destroy({ where: { id: req.params.id } })
      .then((deleteStatus) => {
        res.status(200).send({
          errored: (deleteStatus <= 0),
          message: (deleteStatus <= 0) ? MSG.ERROR.DELETE_UNSUCCESSFUL : MSG.SUCCESS.DELETE_SUCCESS
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.errors[0].message || MSG.ERROR.DELETE_UNSUCCESSFUL
        });
      });
  },
  async getsingle(req, res) {
    // fetch single student
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    if (!req.params.id && !req.body.reg_no) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.INPUT_INVALID });
    }
    /*
    by default students are searched by: student/STUDENT_ID but
     serach can be extended by passing body JSOn objects
     such as { "reg_no" : "STUDENT_REG" }
     */
    let columns = { id: 0 };
    if (req.params.id) columns = req.params;
    if (Object.keys(req.body).length >= 1) columns = req.body;

    return Students
      .findOne({ where: columns })
      .then((result) => {
        res.status(200).send({
          errored: !(result && result.id),
          message: !(result && result.id) ? MSG.ERROR.RECORD_NOT_FOUND : result
        });
      })
      .catch((error) => {
        res.status(400).send({
          errored: true,
          message: error.sqlMessage || MSG.ERROR.RECORD_NOT_FOUND
        });
      });
  },
  async getmultiple(req, res) {
    // fetch multiple student record
    if (await isAuth(req.body, req.cookies.admin_token, 'any') === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    if (Object.keys(req.body).length <= 0) {
      // if no search criteria supplied
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.INPUT_INVALID
      });
    }

    return Students
      .findAll({ where: req.body })
      .then((result) => {
        res.status(200).send({
          errored: !(result && result.length >= 1),
          message: !(result && result.length >= 1) ? MSG.ERROR.RECORD_NOT_FOUND : result
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND
        });
      });
  }
  // @TO-DO: Change student class (promote/demote)
  // --> change class of students (in bulk)
  // @TO-DO: Mark results
};
