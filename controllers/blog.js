const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  return authorization && authorization.toLowerCase().startsWith('bearer ') ?
    authorization.substring(7) :
    null
}


blogRouter.get('/', async (req, resp) => {
  const blogs = await Blog
    .find({})
    .populate('user')
  resp.json(blogs.map(Blog.format))
})

blogRouter.post('/', async (req, resp) => {
  try {
    const body = req.body

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken) {
      return resp.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.title || !body.url) {
      return resp.status(400).json({ error: 'required field missing' })
    }

    if (!body.likes) {
      body.likes = 0
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({ ...body, user: user._id })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return resp.status(201).json(Blog.format(savedBlog))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      resp.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      return resp.status(500).json({ error: 'Something went wrong...' })
    }
  }
})

blogRouter.delete('/:id', async (req, resp) => {
  try {
    const token = jwt.verify(req.token, process.env.SECRET)

    if (!token) {
      return resp.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(token.id)
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return resp.status(404).end()
    }

    if (user.id === blog.user.toString()) {
      blog.remove()
      resp.status(204).end()
    } else {
      resp.status(401).send({ error: 'delete unauthorized' })
    }
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      resp.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      return resp.status(500).json({ error: 'Something went wrong...' })
    }
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
