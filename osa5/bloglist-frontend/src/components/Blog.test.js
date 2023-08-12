import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'React Tester',
    url: 'http://reacttesting.com',
    likes: 11
  }

  const adder = {
    username: 'user',
    name: 'User Name',
    password: 'password'
  }

  const user = {
    username: 'user',
    name: 'User Name',
    password: 'password'
  }

  const { container } = render(<Blog blog={blog} adder={adder} user={user} />)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('clicking view-button shows likes, url and user', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'React Tester',
    url: 'http://reacttesting.com',
    likes: 11
  }

  const adder = {
    username: 'user',
    name: 'User Name',
    password: 'password'
  }

  const fakeuser = {
    username: 'user',
    name: 'User Name',
    password: 'password'
  }

  const { container } = render(<Blog blog={blog} adder={adder} user={fakeuser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlDiv = container.querySelector('.url')
  expect(urlDiv).toHaveTextContent('http://reacttesting.com')
  const likesDiv = container.querySelector('.likes')
  expect(likesDiv).toHaveTextContent('11')
  const adderDiv = container.querySelector('.adder')
  expect(adderDiv).toHaveTextContent('User Name')
})

test('clicking the like-button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'React Tester',
    url: 'http://reacttesting.com',
    likes: 11
  }
  const adder = {
    username: 'user',
    name: 'User Name',
    password: 'password'
  }

  const fakeuser = {
    username: 'user',
    name: 'User Name',
    password: 'password'
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} adder={adder} likeBlog={mockHandler} user={fakeuser} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
