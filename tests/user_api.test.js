const supertest = require('supertest')
const { app, server } = require('../server')

const api = supertest(app)
const User = require('../models/user')
const {
  initialUsers,
  usersInDb,
  postInvalidUser
} = require('./user_helper')

const tryPostingInvalidUser = async (user, error) => {
  const usersAtStart = await usersInDb()

  const resp = await postInvalidUser(api, user)
  expect(resp.body.error).toBe(error)

  const usersAfterOperation = await usersInDb()
  expect(usersAfterOperation.length).toBe(usersAtStart.length)
}

describe('addition of a new user', async () => {
  beforeAll(async () => {
    await User.remove({})

    const userObjects = initialUsers.map(user => new User(user))
    const promises = userObjects.map(user => user.save())
    await Promise.all(promises)
  })

  test('POST /api/users fails with proper statuscode if the username is empty', async () => {
    const newUser = {
      username: '',
      name: 'Arto Hellas',
      password: 'asihdfiojasdfj',
      adult: false
    }

    await tryPostingInvalidUser(newUser, 'username missing')
  })

  test('POST /api/users fails with proper statuscode if the name is empty', async () => {
    const newUser = {
      username: 'hellas',
      name: '',
      password: '0q394asejf',
      adult: false
    }

    await tryPostingInvalidUser(newUser, 'name missing')
  })

  test('POST /api/users fails with proper statuscode if the password is too short', async () => {
    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'ei',
      adult: false
    }

    await tryPostingInvalidUser(newUser, 'password must be at least 3 characters long')
  })

  test('POST /api/users fails with proper statuscode if the username is not unique', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'tosi salainen',
      adult: true
    }

    await tryPostingInvalidUser(newUser, 'username must be unique')
  })

  test('missing adult is initialized to true', async () => {
    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'sekred'
    }

    const usersAtStart = await usersInDb()

    const resp = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersAtStart.length + 1)

    expect(resp.body.adult).toBe(true)
  })
})

afterAll(() => {
  server.close()
})
