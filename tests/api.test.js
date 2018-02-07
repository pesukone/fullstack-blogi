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

describe('get /api/blogs', () => {
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

describe('post /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'uus otsake',
      author: 'uus nimi',
      url: 'uus urli',
      likes: 1337
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const resp = await api
      .get('/api/blogs')

    const titles = resp.body.map(r => r.title)

    expect(resp.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('uus otsake')
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'uus nimi',
      url: 'uus urli',
      likes: 1337
    }

    const initialBlogs = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const resp = await api
      .get('/api/blogs')

    expect(resp.body.length).toBe(initialBlogs.body.length)
  })

  test('blog without author is not added', async () => {
    const newBlog = {
      title: 'uus nimi',
      url: 'uus urli',
      likes: 1337
    }

    const initialBlogs = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const resp = await api
      .get('/api/blogs')

    expect(resp.body.length).toBe(initialBlogs.body.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'uus nimi',
      url: 'uus urli',
      likes: 1337
    }

    const initialBlogs = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const resp = await api
      .get('/api/blogs')

    expect(resp.body.length).toBe(initialBlogs.body.length)
  })
})

afterAll(() => {
  server.close()
})
