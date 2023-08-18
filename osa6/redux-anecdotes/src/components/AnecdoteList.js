import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificate } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <li>
      <div>{anecdote.content}</div>
      <div>has {anecdote.votes} votes {<button onClick={handleClick}>vote</button>}</div>
    </li>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes
    }

    return state.anecdotes.filter(
      anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  })

  const handleVote = (id, content) => {
    dispatch(voteAnecdote(id))
    dispatch(notificate(`You voted "${content}"`))
    setTimeout(() => {dispatch(notificate(''))}, 5000)
  }

  return(
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => handleVote(anecdote.id, anecdote.content)}
        />
      )}
    </ul>
  )
}

export default Anecdotes
