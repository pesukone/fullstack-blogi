const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const goose = require('mongoose')

const app = express()

const Blog = goose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog

app.use(cors())
app.use(bodyParser.json())

const mongoUrl = process.env.MONGODB_URI
goose.connect(mongoUrl)
goose.Promise = global.Promise

app.get('/api/blogs', (req, resp) => {
  Blog
    .find({})
    .then(blogs => {
      resp.json(blogs)
    })
})

app.post('/api/blogs', (req, resp) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => {
      resp.status(201).json(result)
    })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
