const goose = require('mongoose')

const blogSchema = new goose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: goose.Schema.Types.ObjectId, ref: 'User' }
})

blogSchema.statics.format = (blog) => ({
  id: blog._id,
  author: blog.author,
  url: blog.url,
  likes: blog.likes,
  user: blog.user
})

const Blog = goose.model('Blog', blogSchema)

module.exports = Blog
