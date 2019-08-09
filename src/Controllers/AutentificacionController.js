const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.autentificacion.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {

  async register (req, res) {
    try {
      const user = await User.create(req.body)
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (error) {
      res.status(400).send({
        error: 'este email ya esta en uso.'
      })
    }
  },
  async update (req, res) {
    const { email, oldpassword, password } = req.body
    const userId = req.user.id
    try {
      const user = await User.findOne({
        where: {
          id: userId
        }
      })
      if (!user) {
        return res.status(500).send({
          error: 'Usario no encontrado'
        })
      }
      const isPassValid = await user.comparePassword(oldpassword)
      if (!isPassValid) {
        return res.status(400).send({
          error: 'Tu antiguo password no coincide'
        })
      }
      const updateUser = await user.update({ email: email, password: password })
      const userJson = updateUser.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (error) {
      res.status(500).send({
        error: 'Error al escribir las credenciales'
      })
    }
  },
  async indexUser (req, res) {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.userId
        }
      })
      res.send(user)
    } catch (error) {
      res.status(500).send({
        error: 'Usuario no encontrado'
      })
    }
  },
  async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      if (!user) {
        return res.status(403).send({
          error: 'Este correo no existe'
        })
      }
      const isPassValid = await user.comparePassword(password)
      if (!isPassValid) {
        return res.status(403).send({
          error: 'la informacion es incorrecta'
        })
      }

      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(500).send({
        error: 'Un error a ocurrido tratandose de logasre'
      })
    }
  }
}
