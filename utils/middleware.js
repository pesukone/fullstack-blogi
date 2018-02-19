const logger = (req, resp, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }

  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

const error = (req, resp) => {
  resp.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (req, resp, next) => {
  const authorization = req.header('authorization')
  req.token = authorization && authorization.toLowerCase().startsWith('bearer ') ?
    authorization.substring(7) :
    null

  next()
}

module.exports = {
  logger,
  error,
  tokenExtractor
}
