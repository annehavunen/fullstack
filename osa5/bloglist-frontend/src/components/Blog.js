import { useState } from 'react'

const Blog = ({blog, adder, likeBlog, removeBlog, user}) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <div style={{ ...blogStyle, listStyleType: 'none' }}>
          <li className='blog'>
            {blog.title} {blog.author} <button onClick={() => setDetailsVisible(true)}>view</button>
          </li>
        </div>
      </div>
      <div style={showWhenVisible}>
        <div style={{ ...blogStyle, listStyleType: 'none' }}>
          <li>{blog.title} {blog.author} <button onClick={() => setDetailsVisible(false)}>hide</button></li>
          <li className='url'>{blog.url}</li>
          <li className='likes'>{blog.likes} <button onClick={() => likeBlog(blog)}>like</button></li>
          <li className='adder'>{adder.name}</li>
          {user.username === adder.username && (
            <button onClick={() => removeBlog(blog)}>remove</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
