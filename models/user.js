const goose = require('mongoose')

const userSchema = new goose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  adult: Boolean,
  blogs: [{ type: goose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => ({
  id: user.id,
  username: user.username,
  name: user.name,
  adult: user.adult,
  blogs: user.blogs
})

const User = goose.model('User', userSchema)

module.exports = User
