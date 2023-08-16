import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

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
  const anecdotes = useSelector(state => state)

  return(
    <ul>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => dispatch(voteAnecdote(anecdote.id))}
        />
      )}
    </ul>
  )
}

export default Anecdotes
