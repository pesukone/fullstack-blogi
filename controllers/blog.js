const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => ({
  id: blog._id,
  title: blog.title,
  author: blog.author,
  url: blog.url,
  likes: blog.likes
})

blogRouter.get('/', async (req, resp) => {
  const blogs = await Blog.find({})
  resp.json(blogs.map(formatBlog))
})

blogRouter.post('/', async (req, resp) => {
  try {
    const body = req.body

    if (!body.title || !body.url) {
      return resp.status(400).json({ error: 'required field missing' })
    }

    if (!body.likes) {
      body.likes = 0
    }

    const blog = new Blog(req.body)

    const savedBlog = await blog.save()
    return resp.status(201).json(formatBlog(savedBlog))
  } catch (exception) {
    console.log(exception)
    return resp.status(500).json({ error: 'Something went wrong...' })
  }
})

blogRouter.delete('/:id', async (req, resp) => {
  try {
    await Blog.findByIdAndRemove(req.params.id)
    resp.status(204).end()
  } catch (exception) {
    console.log(exception)
    resp.status(400).send({ error: 'malformed id' })
  }
})

module.exports = blogRouter
