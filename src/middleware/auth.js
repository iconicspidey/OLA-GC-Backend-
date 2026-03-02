const MSG = require('../helpers/messages');
const { isAuthenticatedRequest } = require('../controllers/authController');

/**
 * Middleware factory that ensures the request has a valid admin token.
 *
 * @param {string} role  The minimum role required ('principal','any', etc.)
 */
function requireAdmin(role = 'principal') {
  return async (req, res, next) => {
    // allow login routes to bypass
    if (req.path.match(/login/)) {
      return next();
    }
    const valid = await isAuthenticatedRequest(req.body, req.cookies.admin_token, role);
    if (!valid) {
      return res.status(400).send({ errored: true, message: MSG.ERROR.UNAUTHORISED_ACCESS });
    }
    return next();
  };
}

module.exports = {
  requireAdmin
};
