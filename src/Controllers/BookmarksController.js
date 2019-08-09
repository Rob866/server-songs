const { Bookmark, Song } = require('../models')

async function processArray (songs) {
  let dataSongs = []
  let dataSortSongs = []
  for (let index in songs) {
    try {
      let bookmarks = await Bookmark.findAll({
        where: {
          SongId: songs[index].id
        }
      })
      dataSongs.push({ song: songs[index], count: bookmarks.length })
    } catch (error) {
      console.log('error')
    }
  }
  dataSortSongs = dataSongs.sort((a, b) => { return (b.count - a.count) })
  return dataSortSongs
}
module.exports = {
  async index (req, res) {
    // req user autentificacion se obtiene del middleware esta Autentificado
    const userId = req.user.id
    const { songId } = req.query
    if (songId) {
      try {
        const bookmark = await Bookmark.findOne({
          where: {
            UserId: userId,
            SongId: songId
          }
        })
        res.send(bookmark)
      } catch (err) {
        res.status(500).send({
          error: 'error al tratar de obtener el bookmark'
        })
      }
    } else {
      let bookmarkSongs = []
      try {
        const bookmarks = await Bookmark.findAll({
          where: {
            UserId: userId
          },
          include: [
            {
              model: Song
            }
          ],
          order: [
            ['createdAt', 'DESC']
          ]
        })
        bookmarks.forEach(bookmark => {
          bookmarkSongs.push(bookmark.Song)
        })
        res.send(bookmarkSongs)
      } catch (err) {
        res.status(500).send({
          error: 'error al tratar de obtener el bookmark'
        })
      }
    }
  },
  // get numbers of  bookmarks(favorites) for to specific song
  async indexBookmarks (req, res) {
    try {
      let bookmarks = await Bookmark.findAll({
        where: {
          SongId: req.params.songId
        }
      })
      res.send({ fav: bookmarks.length })
    } catch (err) {
      res.status(500).send({
        error: 'error al acceder a los bookmarks de una cancion'
      })
    }
  },
  // get array contain all songs and the numbers of favorite of each song
  async indexAll (req, res) {
    try {
      let songs = await Song.findAll()
      let dataSortSongs = await processArray(songs)
      res.send(dataSortSongs)
    } catch (error) {
      res.status(500).send({
        error: 'error'
      })
    }
  },
  async post (req, res) {
    try {
      const userId = req.user.id
      const { songId } = req.body
      const bookmark = await Bookmark.findOne({
        where: {
          SongId: songId,
          UserId: userId
        }
      })
      if (bookmark) {
        res.status(400).send({
          error: 'Ya lo has puesto como favorito'
        })
      }
      const newBookmark = await Bookmark.create({
        UserId: userId,
        SongId: songId
      })
      res.send(newBookmark)
    } catch (err) {
      res.status(500).send({
        error: 'error al tratar de obtener el bookmark'
      })
    }
  },
  async deleteAll (req, res) {
    if (req.user) {
      try {
        const userId = req.params.userId
        await Bookmark.destroy({
          where: {
            UserId: userId
          }
        })
        res.send(userId)
      } catch (err) {
        console.log(err)
      }
    } else {
      res.status(500).send({
        error: 'error al tratar de borrar las bookmarks'
      })
    }
  },
  async delete (req, res) {
    try {
      const userId = req.user.id
      const { bookmarkId } = req.params
      const bookmark = await Bookmark.findOne({
        where: {
          id: bookmarkId,
          UserId: userId
        }
      })
      if (!bookmark) {
        return res.status(403).send({
          error: 'no tienes acceso a este bookmark'
        })
      }
      await bookmark.destroy()
      res.send(bookmark)
    } catch (err) {
      res.status(500).send({
        error: 'error al tratar de obtener el bookmark'
      })
    }
  }
}
