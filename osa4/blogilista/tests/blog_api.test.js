const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
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

afterAll(async () => {
  await mongoose.connection.close()
})
