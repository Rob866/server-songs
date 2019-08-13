module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {})
  History.associate = function (models) {
    History.belongsTo(models.User, { foreignKey: 'UserId' })
    History.belongsTo(models.Song, { foreignKey: 'SongId' })
  }
  return History
}
