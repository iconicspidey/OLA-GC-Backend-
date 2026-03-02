const { Timers } = require('../database/models');
const MSG = require('../helpers/messages');
const isAuth = require('./authController').isAuthenticatedRequest;

module.exports = {
//   {
//     "stop_time": 30,
//     "class": "JS2",
//     "subjects": ["english", "mathematics"]
// }
  async add(req, res) {
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    const duration = (typeof req.body.stop_time === 'number') ? new Date().setMinutes(new Date().getMinutes() + 30) : 0;
    const stopTime = new Date(duration);
    const exams = [];

    req.body.subjects.forEach((subj) => {
      exams.push({
        class: req.body.class.toUpperCase(),
        subject: subj.toUpperCase(),
        class_subject: `${req.body.class.toUpperCase()}_${subj.toUpperCase()}`,
        arm: req.body.arm || '',
        stop_time: stopTime
      });
    });

    if (!req.body.subjects || !req.body.subjects[0]
      || req.body.subjects.length <= 0 || duration === 0) {
      return res.status(400).send({
        errored: true,
        message: `${MSG.ERROR.INPUT_INVALID}. Class, subject and stop duration must be specified`
      });
    }
    return Timers
      .bulkCreate(exams, {
        fields: ['class_subject', 'class', 'arm', 'stop_time', 'subject'],
        // ignoreDuplicates: true,
        validate: true,
        updateOnDuplicate: ['stop_time']
      })
      .then(() => {
        Timers.findAll().then((result) => {
          res.status(200).send({
            erorred: !(result && result.length >= 1),
            message: !(result && result.length >= 1) ? MSG.ERROR.RECORD_NOT_FOUND : result
          });
        }).catch(() => {
          res.status(400).send({
            erorred: true,
            message: MSG.ERROR.INVALID_SEARCH
          });
        });
      })
      .catch(() => {
        res.status(400).send({
          errored: true,
          message: MSG.ERROR.TIMER_UPDATE_FAILED
        });
      });
  },
  async get(req, res) {
    // fetch all timers
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }

    return Timers
      .findAll()
      .then((result) => {
        res.status(200).send({
          erorred: !(result && result.length >= 1),
          message: !(result && result.length >= 1) ? MSG.ERROR.RECORD_NOT_FOUND : result
        });
      }).catch(() => {
        res.status(400).send({
          erorred: true,
          message: MSG.ERROR.INVALID_SEARCH
        });
      });
  },
  async remove(req, res) {
    // fetch all timers
    if (await isAuth(req.body, req.cookies.admin_token) === false) {
      return res.status(400).send({
        errored: true,
        message: MSG.ERROR.UNAUTHORISED_ACCESS
      });
    }
    if (!req.params.id) {
      return res.status(401).send({ errored: true, message: MSG.ERROR.INPUT_INVALID });
    }
    return Timers
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
