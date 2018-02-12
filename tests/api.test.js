const supertest = require('supertest')
const { app, server } = require('../server')

const api = supertest(app)
const Blog = require('../models/blog')
const {
  initialBlogs,
  blogsInDb,
  postValidBlog,
  postInvalidBlog
} = require('./test_helper')

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promises = blogObjects.map(blog => blog.save())
    await Promise.all(promises)
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.length).toBe(blogsInDatabase.length)

    blogsInDatabase.forEach((blog) => {
      expect(res.body.map(b => b.title)).toContain(blog.title)
    })
  })
})

describe('addition of a new blog', () => {
  test('POST /api/blogs succeeds with valid data', async () => {
    const newBlog = {
      title: 'uus otsake',
      author: 'uus nimi',
      url: 'uus urli',
      likes: 1337
    }

    const blogsAtStart = await blogsInDb()

    await postValidBlog(api, newBlog)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
    expect(blogsAfterOperation.map(b => b.title)).toContain('uus otsake')
  })

  test('POST /api/blogs fails with proper statuscode if title is missing', async () => {
    const newBlog = {
      author: 'uus nimi',
      url: 'uus urli',
      likes: 1337
    }

    const blogsAtStart = await blogsInDb()

    await postInvalidBlog(api, newBlog)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
  })

  test('POST /api/blogs fails with proper statuscode if url is missing', async () => {
    const newBlog = {
      title: 'uus otsake',
      author: 'uus nimi',
      likes: 1337
    }

    const blogsAtStart = await blogsInDb()

    await postInvalidBlog(api, newBlog)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
  })

  test('if no likes are given they are initialized to 0', async () => {
    const newBlog = {
      title: 'uudempi otsake',
      author: 'uudempi nimi',
      url: 'uudempi urli'
    }

    await postValidBlog(api, newBlog)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.filter(blog => blog.title === newBlog.title)[0].likes).toBe(0)
  })
})

afterAll(() => {
  server.close()
})
