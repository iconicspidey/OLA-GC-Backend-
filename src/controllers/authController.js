const { Adminlogin, Students } = require('../database/models');
// const student = require('./student');

function getAdminRole(token = false, attrb = ['role']) {
  if (!token) return 'NOT_FOUND';
  return Adminlogin.findOne({
    attributes: attrb,
    where: { token }
  })
    .then((result) => { // eslint-disable-line
      return (result && result.dataValues) ? result.dataValues : 'NOT_FOUND';
    })
    .catch('NOT_FOUND');
}

function getStudentInfo(token = '') {
  if (typeof token !== 'string' || !token || token.length <= 8) return { status: false };
  const [reg, classs] = token.split('_%%___%%_');
  if (!reg || !classs || reg.length <= 2 || classs.length <= 2) return { status: false };
  return Students.findOne({
    where: { reg_no: reg, class: classs }
  })
    .then((result) => { // eslint-disable-line
      return (result && result.dataValues)
        ? { status: true, data: result.dataValues } : { status: false };
    })
    .catch({ status: false });
}

module.exports = {
  async isAuthenticatedRequest(body = {}, cookie = false, role = 'principal') {
    // check if user can perform requested action
    const adminRole = await getAdminRole(cookie) || false;
    const rolePermitted = (role === 'any' && adminRole.role !== 'NOT_FOUND') ? adminRole.role : role;
    return (typeof body !== 'object' || !adminRole || !adminRole.role)
      ? false : (adminRole.role === rolePermitted);
  },
  async allowedToManageQuestions(body = {}, cookie = false) {
    // check if user can perform requested action
    if (!body.class || !body.subject) return false;
    const admin = await getAdminRole(cookie, ['class', 'subject', 'role']) || false;
    const sameSubjAndClass = ((body.class === await admin.class)
      && (body.subject === await admin.subject));
    return (await sameSubjAndClass || await admin.role === 'principal');
  },
  async isStudent(token = '') {
    // check if user is a student
    const student = await getStudentInfo(token) || { status: false };
    return student;
  }
};
