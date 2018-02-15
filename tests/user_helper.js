const User = require('../models/user')

const initialUsers = [
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    passwordHash: '3uriehriogwt4jiow34u',
    adult: true
  },
  {
    username: 'vruuska',
    name: 'Venla Ruuska',
    passwordHash: '0340r9jwi4oeit0+wietiwh409',
    adult: false
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

const postInvalidUser = async (api, user) => api.post('/api/users').send(user).expect(400)

module.exports = {
  initialUsers,
  usersInDb,
  postInvalidUser
}
