import { useState } from 'react'

const Blog = ({blog, user}) => {
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
        <div style={blogStyle}>
          {blog.title} {blog.author} <button onClick={() => setDetailsVisible(true)}>view</button>
        </div>
      </div>
      <div style={showWhenVisible}>
        <div style={blogStyle}>
          <div>{blog.title} {blog.author} <button onClick={() => setDetailsVisible(false)}>hide</button></div>
          <div>{blog.url}</div>
          <div>{blog.likes} <button type="button">like</button></div>
          <div>{user.name}</div>
        </div>
      </div>
    </div>
  )
}

export default Blog
