const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  const sumOfLikes = blogs.reduce(
    (accumulator, currentBlog) => accumulator + currentBlog.likes, 0
  )

  return sumOfLikes
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  let mostLikes = -1
  let favoriteBlog = blogs[0]
  
  for (const blog of blogs) {
    if (blog.likes > mostLikes) {
      favoriteBlog = blog
      mostLikes = blog.likes
    }
  }

  return favoriteBlog
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  let authorBlogs = {}

  for (const blog of blogs) {
    if (authorBlogs.hasOwnProperty(blog.author)) {
      authorBlogs[blog.author] += 1
    } else {
      authorBlogs[blog.author] = 1
    }
  }

  let biggestAmount = 0
  let blogAuthor

  for (const author in authorBlogs) {
    if (biggestAmount < authorBlogs[author]) {
      biggestAmount = authorBlogs[author]
      blogAuthor = author
    }
  }

  const result = {
    ['author']: blogAuthor,
    ['blogs']: biggestAmount
  }

  return result
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  let authorLikes = {}

  for (const blog of blogs) {
    if (authorLikes.hasOwnProperty(blog.author)) {
      authorLikes[blog.author] += blog.likes
    } else {
      authorLikes[blog.author] = blog.likes
    }
  }

  let mostLikes = -1
  let blogAuthor
  for (const author in authorLikes) {
    if (mostLikes < authorLikes[author]) {
      mostLikes = authorLikes[author]
      blogAuthor = author
    }
  }

  const result = {
    ['author']: blogAuthor,
    ['likes']: mostLikes
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
