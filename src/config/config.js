module.exports = {
  port: process.env.DB_PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    options: {
      dialect: 'postgres',
      host: process.env.HOST || 'localhost'
    }
  },
  autentificacion: {
    jwtSecret: process.env.JWT_SECRET || 'secret'

  }
}
