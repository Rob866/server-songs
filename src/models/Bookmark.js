module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {})
  Bookmark.associate = function (models) {
    Bookmark.belongsTo(models.User, { foreignKey: 'UserId' })
    Bookmark.belongsTo(models.Song, { foreignKey: 'SongId' })
  }
  return Bookmark
}
