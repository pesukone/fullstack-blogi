const getAuthors = blogs =>
  Array.from(blogs.reduce((set, curr) => set.add(curr.author), new Set()))

const blogCount = (author, blogs) =>
  blogs.reduce((count, curr) => curr.author === author ? count + 1 : count, 0)

const likeCount = (author, blogs) =>
  blogs.reduce((count, curr) => curr.author === author ? count + curr.likes : count, 0)

const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = blogs => blogs.slice().sort((a, b) => b.likes - a.likes)[0]

const mostBlogs = blogs =>
  getAuthors(blogs)
    .map(name => ({ author: name, blogs: blogCount(name, blogs) }))
    .sort((a, b) => b.blogs - a.blogs)[0]

const mostLikes = blogs =>
  getAuthors(blogs)
    .map(name => ({ author: name, likes: likeCount(name, blogs) }))
    .sort((a, b) => b.likes - a.likes)[0]


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
