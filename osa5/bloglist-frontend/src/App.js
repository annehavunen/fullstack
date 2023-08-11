import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((blog1, blog2) => blog2.likes - blog1.likes))
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
    .create(blogObject)
    .then(returnedBlog => {
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {setNotificationMessage(null)}, 5000)
    })
    .catch(error => {
      setNotificationMessage(error.response.data['error'])
      setTimeout(() => {setNotificationMessage(null)}, 5000)
    })
  }

  const likeBlog = (blog) => {
    const likes = blog.likes + 1
    const likedBlog = { ...blog, likes: likes}
    blogService
    .update(blog.id, likedBlog)
    .then((returnedBlog) => {
      returnedBlog.user = blog.user
      setBlogs(blogs
        .map(b => b.id !== blog.id ? b :returnedBlog)
        .sort((blog1, blog2) => blog2.likes - blog1.likes)
      )
    })
    .catch(error => {
      setNotificationMessage(error.response.data['error'])
      setTimeout(() => {setNotificationMessage(null)}, 5000)
    })
  }

  const removeBlog = (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (ok) {
      blogService
      .remove(blog.id)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
      })
      .catch(() => {
        setNotificationMessage(`Blog ${blog.title} by ${blog.author} has already been removed from server`)
        setTimeout(() => {setNotificationMessage(null)}, 5000)
        setBlogs(blogs
          .filter(b => b.id !== blog.id)
          .sort((blog1, blog2) => blog2.likes - blog1.likes)
        )
      })
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notificationMessage} />
        <form onSubmit={handleLogin}>
          <div> 
            username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div> 
            password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog 
          key={blog.id}
          blog={blog}
          adder={blog.user}
          likeBlog={likeBlog}
          removeBlog={removeBlog}
          user={user}
        />
      )}
    </div>
  )
}

export default App
