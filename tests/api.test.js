const supertest = require('supertest')
const { app, server } = require('../server')

const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'otsake1',
    author: 'nimi1',
    url: 'urli1',
    likes: 9
  },
  {
    title: 'otsake2',
    author: 'nimi2',
    url: 'urli2',
    likes: 8
  }
]

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)
})

describe('get /api/blogs', async () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const resp = await api
      .get('/api/blogs')

    expect(resp.body.length).toBe(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const resp = await api
      .get('/api/blogs')

    const titles = resp.body.map(r => r.title)

    expect(titles).toContain('otsake2')
  })
})

afterAll(() => {
  server.close()
})
