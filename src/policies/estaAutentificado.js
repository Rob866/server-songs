const passport = require('passport')

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user) {
    if (err || !user) {
      return res.status(403).send({
        error: 'no tienes acceso a  este contenido'
      })
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}
