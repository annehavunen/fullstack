const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  expect(titles).toContain('Great title')
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Extra title',
    author: 'Extra Writer',
    url: 'http://extrablog.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('Extra title')
})

test('blogs have "id" field', async () => {
  const response = await api.get('/api/blogs')
  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('if the "likes" field is not given a value, its value is 0', async () => {
  const newBlog = {
    title: 'Likeless',
    author: 'Lucky Like',
    url: 'http://likeless.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  const likelessBlog = blogsAtEnd.find((blog) => blog.title === 'Likeless')
  expect(likelessBlog.likes).toBe(0)
})

test('if title or url is missing, "400 Bad Request" is returned', async () => {
  const newBlogWithoutTitle = {
    author: 'Title Less',
    url: 'http://titleless.com',
    likes: 0
  }

  const newBlogWithoutUrl = {
    title: 'Without url',
    author: 'Url Less',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const newBlogData = {
    title: 'New blog',
    author: 'Blog Newton',
    url: 'http://newblog.com',
    likes: 0,
  }

  const newBlog = await api
    .post('/api/blogs')
    .send(newBlogData)
    .expect(201)

  const updatedBlogData = {
    title: 'Updated Blog',
    author: 'Up Dater',
    url: 'http://updatedblog.com',
    likes: 15
  }

  await api
    .put(`/api/blogs/${newBlog.body.id}`)
    .send(updatedBlogData)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const updatedBlog = blogsAtEnd.find((blog) => blog.id === newBlog.body.id)
  expect(updatedBlog.likes).toBe(15)
  expect(updatedBlog).not.toEqual(newBlog)
})

afterAll(async () => {
  await mongoose.connection.close()
})
