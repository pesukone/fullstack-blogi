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

blogRouter.get('/', async (req, resp) => {
  const blogs = await Blog.find({})
  resp.json(blogs.map(formatBlog))
})

blogRouter.post('/', async (req, resp) => {
  try {
    const body = req.body

    if (!body.title || !body.author || !body.url) {
      return resp.status(400).json({ error: 'required field missing' })
    }

    const blog = new Blog(req.body)

    const savedBlog = await blog.save()
    return resp.status(201).json(formatBlog(savedBlog))
  } catch (exception) {
    console.log(exception)
    return resp.status(500).json({ error: 'Something went wrong...' })
  }
})

module.exports = blogRouter
