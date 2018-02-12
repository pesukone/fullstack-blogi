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
    author: 'nimi',
    url: 'urli2',
    likes: 8
  }
]

const formatBlog = (blog) => ({
  id: blog._id,
  title: blog.title,
  author: blog.author,
  url: blog.url,
  likes: blog.likes
})

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(formatBlog)
}

const postInvalidBlog = async (api, blog) => api.post('/api/blogs').send(blog).expect(400)

const postValidBlog = async (api, blog) =>
  api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

module.exports = {
  initialBlogs,
  blogsInDb,
  postValidBlog,
  postInvalidBlog
}
