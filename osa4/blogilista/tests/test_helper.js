const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog title',
    author: 'Blog Writer',
    url: 'http://blog.com',
    likes: 10
  },
  {
    title: 'Great title',
    author: 'Great Writer',
    url: 'http://greatblog.com',
    likes: 20
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
}
