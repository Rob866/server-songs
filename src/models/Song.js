
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    titulo: DataTypes.STRING,
    artista: DataTypes.STRING,
    genero: DataTypes.STRING,
    album: DataTypes.STRING,
    albumImagenUrl: DataTypes.STRING,
    youtubeId: DataTypes.STRING,
    letra: DataTypes.TEXT,
    tab: DataTypes.TEXT

  })
  Song.associate = function (models) {
    Song.belongsTo(models.User)
    Song.hasMany(models.Bookmark, { onDelete: 'CASCADE', hooks: true })
    Song.hasMany(models.History, { onDelete: 'CASCADE', hooks: true })
  }
  return Song
}
