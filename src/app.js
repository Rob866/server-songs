const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { sequelize } = require('./models')
// const config = require('./config/config')
require('dotenv').config()

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
require('./passport')

require('./routes')(app)

sequelize.sync({ force: false })
  .then(() => {
    // app.listen(config.port)
    app.listen(process.env.PORT, '0.0.0.0')
    // console.log(`incio del servidor  en el puerto ${config.port}`)
  })
