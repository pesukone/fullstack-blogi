const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const goose = require('mongoose')

const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')

const app = express()

const mongoUrl = process.env.MONGODB_URI
goose.connect(mongoUrl)
goose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

app.use(middleware.logger)
app.use('/api/blogs', blogRouter)
app.use(middleware.error)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
