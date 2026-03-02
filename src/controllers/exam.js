const { Students, Results, sequelize } = require('../database/models');
const MSG = require('../helpers/messages');
const isAStudent = require('./authController').isStudent;
const isAuth = require('./authController').isAuthenticatedRequest;
// const subjects = require('../../constants');

module.exports = {
  async login(req, res) {
    // log student and return temp token
    if (!req.body.reg_no || !req.body.password) {
      return res.status(400).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Kindly enter your admission number`
      });
    }
    return Students
      .findOne({
        where: {
          reg_no: req.body.reg_no,
          password: req.body.password
        }
      })
      .then((result) => {
        if (result.reg_no && result.class) {
          return res.status(200).send({
            erorred: false,
            message: `${result.reg_no}_%%___%%_${result.class}`
          });
        }
        // login not successful
        return res.status(200).send({
          erorred: true,
          message: MSG.ERROR.WRONG_LOGIN
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.ERROR_LOGGING_IN
        });
      });
  },
  async self(req, res) {
    // fetch self data
    const student = await isAStudent(req.cookies.student_token || '');
    if (await student.status === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    return res.status(200).send({
      errored: false,
      message: student.data || {}
    });
  },
  async subjects(req, res) {
    // fetch sbjects due for student to take exans
    const student = await isAStudent(req.cookies.student_token || '');
    if (await student.status === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    const query = `SELECT class, subject, stop_time FROM Timers WHERE class = '${student.data.class}' AND stop_time > now() ORDER BY stop_time ASC`;
    return sequelize
      .query(query)
      .then(([result]) => {
        if (!result || !result[0] || !result[0].subject || result.length <= 0) {
          return res.status(200).send({
            erorred: false,
            message: []
          });
        }

        return res.status(200).send({
          erorred: false,
          message: !(result && result.length >= 1) ? [] : result
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND
        });
      });
  },
  async questions(req, res) {
    // fetch questions for a subject
    const student = await isAStudent(req.cookies.student_token || '');
    if (await student.status === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    const currentSubject = req.query.subject || false;

    const query = `SELECT class, subject, stop_time FROM Timers WHERE class = '${student.data.class}' AND stop_time > now() ORDER BY stop_time ASC`;
    return sequelize
      .query(query)
      .then(([result]) => {
        if (!result || !result[0] || !result[0].subject || result.length <= 0 || !currentSubject) {
          return res.status(200).send({
            erorred: false,
            message: { subjects: [], questions: [], currentSubject: '' }
          });
        }
        const subjecToTake = [];
        result.forEach((subj) => {
          subjecToTake.push(subj.subject);
        });

        const query2 = `SELECT * FROM Questions WHERE subject = '${currentSubject}' AND class = '${student.data.class}'`;
        return sequelize.query(query2)
          .then((result2) => { // eslint-disable-line
            res.status(200).send({
              erorred: false,
              message: !(result2 && result2.length >= 1)
                ? [] : { subjects: subjecToTake, questions: result2, currentSubject }
            });
          }).catch(() => { // eslint-disable-line
            res.status(200).send({
              erorred: false,
              message: { subjects: [], questions: [], currentSubject: '' }
            });
          });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND
        });
      });
  },
  async results(req, res) {
    // fetch result/answered questions
    const student = await isAStudent(req.cookies.student_token || '');
    if (await student.status === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    return Results
      .findOne({
        where: {
          reg_no_class: `${student.data.reg_no}_${student.data.class}`
        }
      })
      .then((result) => {
        if (result.results && result.results.length >= 1) {
          return res.status(200).send({
            erorred: false,
            message: JSON.parse(result.results) || false
          });
        }
        // result empty
        return res.status(200).send({
          erorred: true,
          message: false
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.ERROR_RETRIEVING_RESULT
        });
      });
  },
  async submitAnswer(req, res) {
    // submit answer
    const student = await isAStudent(req.cookies.student_token || '');
    if (await student.status === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    return Results
      .findOne({
        where: {
          reg_no_class: `${student.data.reg_no}_${student.data.class}`
        }
      })
      .then((result) => {
        // result empty
        const studentAnswer = req.body.ans || {};
        let newResult = [];
        const previousResult = (JSON.parse(result.results)) ? JSON.parse(result.results) : {};
        if (Object.keys(studentAnswer).length >= 1) {
          newResult = (typeof previousResult === 'object' && typeof studentAnswer === 'object')
            ? [{ ...previousResult, ...studentAnswer }] : [previousResult];
        }

        newResult = (newResult[0] && newResult.length >= 1) ? newResult[0] : previousResult;
        const query = `UPDATE Results SET results = '${JSON.stringify(newResult)}' WHERE reg_no_class = '${`${student.data.reg_no}_${student.data.class}'`} `;
        return sequelize.query(query)
          .then(() => {
            res.status(200).send({
              erorred: false,
              message: MSG.SUCCESS.PROGRESS_SAVED
            });
          })
          .catch(() => {
            res.status(200).send({
              errored: false,
              message: MSG.SUCCESS.PROGRESS_SAVED
            });
          });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.ERROR_RETRIEVING_RESULT
        });
      });
  },
  async addStudents(req, res) {
    // bulk adding of students to take exams
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.body[0] || !req.body[0].reg_no || !req.body[0].class || !req.body[0].reg_no_class) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.BAD_REQUEST });
    }
    // if all is well
    return Results.bulkCreate(req.body, {
      fields: ['reg_no', 'class', 'reg_no_class'],
      ignoreDuplicates: true,
      validate: true
      // updateOnDuplicate: ['reg_no']
    })
      .then(() => {
        res.status(201).send({
          erorred: false,
          message: MSG.SUCCESS.STUDENT_UPLOAD_SUCCESS
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.STUDENT_UPLOAD_FAIL
        });
      });
  }
};
