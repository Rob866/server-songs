const {
  sequelize,
  Song,
  User,
  Bookmark,
  History
} = require('../src/models')

const Promise = require('bluebird')
const songs = require('./songs.json')
const users = require('./users.json')
const histories = require('./history.json')
const bookmarks = require('./bookmarks.json')

sequelize.sync({ force: true })
  .then(async function () {
    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )
    await Promise.all(
      songs.map(async function (song) {
        let testUser = await Song.create(song)
        testUser.setUser(1)
      })
    )
    await Promise.all(
      bookmarks.map(bookmark => {
        Bookmark.create(bookmark)
      }))
    await Promise.all(
      histories.map(history => {
        History.create(history)  
      }))
  })
