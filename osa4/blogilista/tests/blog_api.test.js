const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
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

  test('blogs have "id" field', async () => {
    const response = await api.get('/api/blogs')
    for (const blog of response.body) {
      expect(blog.id).toBeDefined()
    }
  })
  
  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })

      const newBlog = {
        title: 'Extra title',
        author: 'Extra Writer',
        url: 'http://extrablog.com',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain('Extra title')
    })

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'Extra title',
        author: 'Extra Writer',
        url: 'http://extrablog.com',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })

    test('increases the blog amount of the user', async () => {
      const usersAtStart = await helper.usersInDb()
      const initialBlogs = usersAtStart[0].blogs.length

      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })

      const newBlog = {
        title: 'Extra title',
        author: 'Extra Writer',
        url: 'http://extrablog.com',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd[0].blogs.length).toBe(initialBlogs + 1)
    })

    test('sets the "likes" field value 0 as a default', async () => {
      const loggedUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

      const newBlog = {
        title: 'Likeless',
        author: 'Lucky Like',
        url: 'http://likeless.com'
      }

      await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .expect(201)
    
      const blogsAtEnd = await helper.blogsInDb()
      const likelessBlog = blogsAtEnd.find((blog) => blog.title === 'Likeless')
      expect(likelessBlog.likes).toBe(0)
    })

    test('fails with status code 400 if title or url is missing', async () => {
      const loggedUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

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
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(400)
    
      await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id and token are valid', async () => {
      const loggedUser = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })

      const newBlog = {
        title: 'Extra title',
        author: 'Extra Writer',
        url: 'http://extrablog.com',
        likes: 2
      }

      const blogToDelete = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)

      const usersAtStart = await helper.usersInDb()
      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogToDelete.body.id}`)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(204)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd[0].blogs).toHaveLength(usersAtStart[0].blogs.length - 1)
    })

    test('fails with status code 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      await api
        .delete(`/api/blogs/${blogsAtStart[0].id}`)
        .expect(401)
      
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length) 
    })
  })
  
  describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
      const loggedUser = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

      const newBlogData = {
        title: 'New blog',
        author: 'Blog Newton',
        url: 'http://newblog.com',
        likes: 0,
      }

      const newBlog = await api
        .post('/api/blogs')
        .send(newBlogData)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
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
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'fuser',
      name: 'Fresh User',
      password: 'supersecret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails if username or password is missing', async () => {
    const userWithoutUsername = {
      name: 'Name Less',
      password: 'topsecret'
    }
  
    const userWithoutPassword = {
      username: 'passwordless',
      name: 'No Pass'
    }

    const userWithoutUsernameAndPassword = {
      name: 'No Thing'
    }
  
    await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)
  
    await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400)

    await api
      .post('/api/users')
      .send(userWithoutUsernameAndPassword)
      .expect(400)
  })

  test('creation fails with too short username or password', async () => {
    const tooShortUsername = {
      username: 'us',
      name: 'Too Short',
      password: 'ultimatesecret'
    }
  
    const tooShortPassword = {
      username: 'username',
      name: 'Too Short',
      password: 'ul'
    }
  
    const tooShortUsernameAndPassword = {
      username: 'us',
      name: 'Too Short',
      password: 'ul'
    }

    await api
    .post('/api/users')
    .send(tooShortUsername)
    .expect(400)

    await api
    .post('/api/users')
    .send(tooShortPassword)
    .expect(400)

    await api
    .post('/api/users')
    .send(tooShortUsernameAndPassword)
    .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
