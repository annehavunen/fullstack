import { useState } from 'react'

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return (
      <>
        <td>{props.text}</td>
        <td>{props.value} %</td>
      </>
    )
  }
  return (
    <>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <StatisticLine text="good" value={props.good}/>
          </tr>
          <tr>
            <StatisticLine text="neutral" value={props.neutral}/>
          </tr>
          <tr>
            <StatisticLine text="bad" value={props.bad}/>
          </tr>
          <tr>
            <StatisticLine text="all" value={props.all}/>
          </tr>
          <tr>
            <StatisticLine text="average" value={props.average}/>
          </tr>
          <tr>
            <StatisticLine text="positive" value={props.positive}/>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [count, setCount] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const increaseGood = () => {
    const updatedGood = good + 1
    const updatedAll = updatedGood + neutral + bad
    const updatedCount = count + 1
    setGood(updatedGood)
    setAll(updatedAll)
    setCount(updatedCount)
    setAverage(updatedCount / updatedAll)
    setPositive(updatedGood / updatedAll * 100)
  }
  const increaseNeutral = () => {
    const updatedNeutral = neutral + 1
    const updatedAll = good + updatedNeutral + bad
    setNeutral(updatedNeutral)
    setAll(updatedAll)
    setAverage(count / updatedAll)
    setPositive(good / updatedAll * 100)
  }
  const increaseBad = () => {
    const updatedBad = bad + 1
    const updatedAll = good + neutral + updatedBad
    const updatedCount = count - 1
    setBad(updatedBad)
    setAll(updatedAll)
    setCount(updatedCount)
    setAverage(updatedCount / updatedAll)
    setPositive(good / updatedAll * 100)
  }

  return (
    <div>
      <h2>give feedback</h2>
      <Button
        handleClick={increaseGood}
        text='good'
      />
      <Button
        handleClick={increaseNeutral}
        text='neutral'
      />
      <Button
        handleClick={increaseBad}
        text='bad'
      />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App
