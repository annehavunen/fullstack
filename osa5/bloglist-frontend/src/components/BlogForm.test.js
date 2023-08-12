import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('blog title')
  const authorInput = screen.getByPlaceholderText('blog author')
  const urlInput = screen.getByPlaceholderText('blog url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'here is the title')
  await user.type(authorInput, 'here is the author')
  await user.type(urlInput, 'here is the url')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('here is the title')
  expect(createBlog.mock.calls[0][0].author).toBe('here is the author')
  expect(createBlog.mock.calls[0][0].url).toBe('here is the url')
})
