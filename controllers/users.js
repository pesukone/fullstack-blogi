const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, resp) => {
  const users = await User
    .find({})

  resp.json(users.map(User.format))
})

usersRouter.post('/', async (req, resp) => {
  try {
    const body = req.body

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length > 0) {
      return resp.status(400).json({ error: 'username must be unique' })
    }

    if (body.password.length < 3) {
      return resp.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    if (!body.username) {
      return resp.status(400).json({ error: 'username missing' })
    }

    if (!body.name) {
      return resp.status(400).json({ error: 'name missing' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: body.adult === undefined ? true : body.adult
    })

    const savedUser = await user.save()

    resp.status(201).json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    resp.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter
