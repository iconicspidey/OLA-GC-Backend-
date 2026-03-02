const { Questions, sequelize } = require('../database/models');
const MSG = require('../helpers/messages');
const isAllowed = require('./authController').allowedToManageQuestions;
const subjects = require('../../constants');

module.exports = {
  async single(req, res) {
    // insert single question
    // @TO-DO: Object destruction of req.body
    if (await isAllowed(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.body.optiona || !req.body.optionb || !req.body.question
      || req.body.optiona.length <= 1 || req.body.optionb.length <= 1
      || req.body.question.length <= 1 || !subjects[req.body.class.toUpperCase()]) {
      return res.status(400).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID} You must provide atleast a question, option a, option b and also correct answer`
      });
    }
    const crtAns = req.body[`option${req.body.correct_answer}`];
    if (!crtAns || crtAns.trim().length < 1) {
      return res.status(400).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Correct answer cannot be empty. kindly provide an input for correct answer for this question`
      });
    }
    const subjExist = subjects[req.body.class].includes(req.body.subject.toUpperCase());
    if (subjExist === false) {
      // check if selected subject exists or not
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.SUBJECT_NOT_FOUND
      });
    }
    return Questions
      .create({
        class: req.body.class.toUpperCase(),
        subject: req.body.subject.toUpperCase(),
        instruction_before: req.body.instruction_before || '',
        question: req.body.question,
        optiona: req.body.optiona,
        optionb: req.body.optionb,
        optionc: req.body.optionc || '',
        optiond: req.body.optiond || '',
        optione: req.body.optione || '',
        correct_answer: req.body.correct_answer || 'a',
        marks: req.body.marks || 1
      })
      .then(() => {
        res.status(201).send({
          erorred: false,
          message: MSG.SUCCESS.QUESTION_INSERT
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.QUESTION_INSERT_FAIL
        });
      });
  },
  async bulk(req, res) {
    // insert single question
    /* {
      'subject': 'subject',
      'class': 'class',
      'questions': [
        {
          "question":"What is <b>a noun</a>?",
          "optiona": "A person in <p>Abuja</p>",
          "optionb": "Cannot be anything serious",
          "instruction_before": "Dont asnwer it",
          "correct_answer": "b"
      },
      {
        "question":"What is <b>a noun</a>?",
        "optiona": "A person in <p>Abuja</p>",
        "optionb": "Cannot be anything serious",
        "optionc": "Cannot be anything serious",
        "instruction_before": "Dont asnwer it",
        "correct_answer": "b"
    }
      ]
    } */
    if (!req.body.class || !req.body.subject || !req.body.questions
      || !req.body.questions[0] || !req.body.questions[0].question
      || req.body.questions.length <= 1 || !subjects[req.body.class.toUpperCase()]) {
      // console.log(subjects, req.body.class);
      return res.status(400).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Kindly check the docs on how to do bulk question upload`
      });
    }
    if (await isAllowed(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    const subjExist = subjects[req.body.class].includes(req.body.subject.toUpperCase());
    if (subjExist === false) {
      // check if selected subject exists or not in selected class
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.SUBJECT_NOT_FOUND
      });
    }
    const questions = [];
    req.body.questions.forEach((question) => {
      const subjAndClass = {
        class: req.body.class.toUpperCase(),
        subject: req.body.subject.toUpperCase()
      };
      questions.push({ ...question, ...subjAndClass });
    });
    return Questions
      .bulkCreate(questions, {
        fields: ['class', 'subject', 'instruction_before', 'question', 'optiona', 'optionb', 'optionc', 'optiond', 'optione', 'correct_answer', 'marks'],
        ignoreDuplicates: true,
        validate: true
      })
      .then(() => {
        res.status(201).send({
          erorred: false,
          message: MSG.SUCCESS.BULK_OPERATION_SUCCESSFUL
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.QUESTION_INSERT_FAIL
        });
      });
  },
  async getsingle(req, res) {
    // get single question
    if (await isAllowed(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    // search by id only
    if (!req.params.id) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.INPUT_INVALID });
    }

    return Questions
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        res.status(200).send({
          erorred: !(result && result.id),
          message: !(result && result.id) ? MSG.ERROR.RECORD_NOT_FOUND : result
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND
        });
      });
  },
  async getmultiple(req, res) {
    // get multiple question
    if (await isAllowed(req.body, req.cookies.admin_token) === false) {
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

    return Questions
      .findAll({ where: req.body })
      .then((result) => {
        res.status(200).send({
          erorred: !(result && result.length >= 1),
          message: !(result && result.length >= 1) ? MSG.ERROR.RECORD_NOT_FOUND : result
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_NOT_FOUND
        });
      });
  },
  async update(req, res) {
    // get multiple question
    if (await isAllowed(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.params.id || !req.body || req.body.id || typeof req.body !== 'object') {
      return res.status(401).send({
        errored: true,
        message: MSG.ERROR.INPUT_INVALID
      });
    }
    let query = '';

    for (const [key, value] of Object.entries(req.body)) { // eslint-disable-line
      query += (query.length > 1) ? `, ${key} = '${value}' ` : ` ${key} = '${value}'`;
    }
    query = (query.length > 1)
      ? `UPDATE Questions SET ${query} WHERE id = ${req.params.id}` : '';

    return sequelize.query(query)
      .then((rslt) => {
        res.status(200).send({
          erorred: (rslt[0].affectedRows < 1),
          message: (rslt[0].affectedRows < 1)
            ? MSG.ERROR.RECORD_UPDATE_FAILED : MSG.SUCCESS.RECORD_UPDATED
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.RECORD_UPDATE_FAILED
        });
      });
  },
  async remove(req, res) {
    // remove question
    if (await isAllowed(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.params.id) {
      return res.status(401).send({
        errored: true,
        message: MSG.ERROR.INPUT_INVALID
      });
    }
    return Questions
      .destroy({ where: { id: req.params.id } })
      .then((deleteStatus) => {
        res.status(200).send({
          erorred: (deleteStatus <= 0),
          message: (deleteStatus <= 0) ? MSG.ERROR.DELETE_UNSUCCESSFUL : MSG.SUCCESS.DELETE_SUCCESS
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.DELETE_UNSUCCESSFUL
        });
      });
  }
};
