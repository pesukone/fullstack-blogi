const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, resp) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null ?
    false :
    await bcrypt.compare(body.password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return resp.status(401).send({ error: 'invalid username or password' })
  }

  const token = jwt.sign({ username: user.username, id: user._id}, process.env.SECRET)

  resp.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
