const { Song } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  async index (req, res) {
    try {
      let songs = null
      const search = req.query.search
      if (search) {
        songs = await Song.findAll({
          where: {
            [Op.or]: [
              'titulo', 'artista', 'genero', 'album'
            ].map(key => ({
              [key]: {
                [Op.like]: `%${search}%`
              }
            }))
          }
        })
      } else {
        songs = await Song.findAll({
          limit: 20
        })
      }
      res.send(songs)
    } catch (err) {
      res.status(500).send({
        error: 'acceso a canciones fallida'
      })
    }
  },
  async show (req, res) {
    try {
      const song = await Song.findByPk(req.params.songId)
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'acceso a cancion fallida'
      })
    }
  },
  async put (req, res) {
    try {
      await Song.update(req.body, {
        where: {
          id: req.params.songId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'intento de edicion fallida'
      })
    }
  },
  async post (req, res) {
    try {
      const song = await Song.create(req.body)
      await song.setUser(req.user.id)
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'creacion de cancion fallida'
      })
    }
  },
  async delete (req, res) {
    if (req.user) {
      try {
        const songId = req.params.songId
        const song = await Song.findOne({
          where: {
            id: songId
          }
        })
        if (!song) {
          return res.status(403).send({
            error: 'Probleme al encontrar la cancion'
          })
        }
        await song.destroy()
        res.send(songId)
      } catch (err) {
        res.status(500).send({
          error: 'no  tiene permisos'
        })
      }
    } else {
      res.status(500).send({
        error: 'no tiene permisos'
      })
    }
  }
}
