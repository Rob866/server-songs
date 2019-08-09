const Joi = require('joi')

module.exports = {
  update (req, res, next) {
    const { email, oldpassword, password } = req.body
    if (!email || !password || !oldpassword) {
      res.status(400).send({
        error: 'Campos incompletos'
      })
    }
    const esquema = {
      email: Joi.string().email(),
      oldpassword: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      ),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      )
    }
    // eslint-disable-next-line no-unused-vars
    const { error, value } = Joi.validate(req.body, esquema)
    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'Dirección de email no valida.'
          })
          break
        case 'password':
          res.status(400).send({
            error: `El campo password debe seguir las siguientes reglas:
          <br>
           1. Debe contenener solo los siguientes caracteres: minúsculas,mayúsculas,
          <br> 
           2. Debe  tener por lo menos 8 caractéres y menos de 32 caractéres.
          `
          })
          break
        case 'oldpassword':
          res.status(400).send({
            error: `El campo password debe seguir las siguientes reglas:
          <br>
           1. Debe contenener solo los siguientes caracteres: minúsculas,mayúsculas,
          <br> 
           2. Debe  tener por lo menos 8 caractéres y menos de 32 caractéres.
          `
          })
          break
        default:
          res.status(400).send({
            error: 'información de registro inválida'
          })
          break
      }
    } else {
      next()
    }
  }
}
