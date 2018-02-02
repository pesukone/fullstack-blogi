const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes
  }
}

blogRouter.get('/', (req, resp) => {
  Blog
    .find({})
    .then(blogs => {
      resp.json(blogs.map(formatBlog))
    })
})

blogRouter.post('/', (req, resp) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => {
      resp.status(201).json(formatBlog(result))
    })
})

module.exports = blogRouter
