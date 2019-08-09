const { User } = require('../models')

module.exports = {
  async index (req, res) {
    console.log(req.params.userId)
    try {
      const user = await User.findOne({
        where: {
          id: req.user.id
        }
      })
      const songs = await user.getSongs()
      res.send(songs)
    } catch (err) {
      res.status(500).send({
        error: 'acceso a canciones creadas fallida'
      })
    }
  }
}
