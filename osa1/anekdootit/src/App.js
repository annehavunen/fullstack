import { useState } from 'react'

const MostVotes = (props) => {
  const max = Math.max(...props.points)
  const index = props.points.indexOf(max)
  return (
    <div>
      <p>
        {props.anecdotes[index]}<br />
        has {max} votes
      </p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(8).fill(0))

  const createRandom = () => {
    const random = Math.floor(Math.random() * 8)
    setSelected(random)
  }
  
  const handleVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}<br />
      has {points[selected]} votes<br />
      <button onClick={handleVote}>
        vote
      </button>
      <button onClick={createRandom}>
        next anecdote
      </button>
      <h2>Anecdote with most votes</h2>
      <MostVotes points={points} anecdotes={anecdotes}/>
    </div>
  )
}


// const App = (props) => {
//   const [value, setValue] = useState(10)

//   const setToValue = (newValue) => {
//     console.log('value now', newValue)
//     setValue(newValue)
//   }

//   return (
//     <div>
//       {value}
//       <button onClick={() => setToValue(1000)}>
//         thousand
//       </button>
//       <button onClick={() => setToValue(0)}>
//         reset
//       </button>
//       <button onClick={() => setToValue(value + 1)}>
//         increment
//       </button>
//     </div>
//   )
// }


export default App