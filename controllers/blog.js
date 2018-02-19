const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, resp) => {
  const blogs = await Blog
    .find({})
    .populate('user')
  resp.json(blogs.map(Blog.format))
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

    const user = await User.findOne()

    const blog = new Blog({ ...body, user: user._id })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return resp.status(201).json(Blog.format(savedBlog))
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

blogRouter.put('/:id', async (req, resp) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    resp.json(formatBlog(updated))
  } catch (exception) {
    resp.status(400).send({ error: 'malformed id' })
  }
})

module.exports = blogRouter
