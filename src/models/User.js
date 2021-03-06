const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user, options) {
  const SALT_FACTOR = 8
  if (!user.changed('password')) {
    return
  }
  return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash => {
      user.setDataValue('password', hash)
    })
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeSave: hashPassword
    }
  })
  User.associate = function (models) {
    User.hasMany(models.Song, { onDelete: 'CASCADE', hooks: true })
    User.hasMany(models.Bookmark, { onDelete: 'CASCADE', hooks: true })
    User.hasMany(models.History, { onDelete: 'cascade', hooks: true })
  }

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }
  return User
}
