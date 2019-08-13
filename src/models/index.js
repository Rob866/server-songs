const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
// const config = require('../config/config')
const db = {}

// const { database, user, password, options } = config.db
// const sequelize = new Sequelize(database, user, password, options)
const sequelize = new Sequelize('postgres://chpfkcqwqpiknp:8a1a108b73dfcdf9f128d0fe959563e3da3d1196abbea3a06b14f06bc31b415c@ec2-174-129-229-106.compute-1.amazonaws.com:5432/d15t4hekreld5m')

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return file !== 'index.js'
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
