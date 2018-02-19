const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const goose = require('mongoose')

const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const app = express()

goose.connect(config.mongoUrl)
goose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

app.use(middleware.logger)
app.use(middleware.tokenExtractor)
app.use(middleware.error)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  goose.connection.close()
})

module.exports = {
  app, server
}
