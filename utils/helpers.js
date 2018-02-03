const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => blogs.slice().sort((a, b) => b.likes - a.likes)[0]

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
