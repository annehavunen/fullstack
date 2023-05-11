const Header = (props) => {
    return (
      <div>
        <h2>{props.course}</h2>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>{props.part.name} {props.part.exercises}</p>
      </div>
    )
  }
  
  const Content = (props) => {
    return (
      <div>
        <ul>
          {props.parts.map(part => 
            <li key={part.id}>
              <Part part={part}/>
            </li>
          )}
        </ul>
      </div>
    )
  }
  
  const Total = (props) => {
    const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <div>
        <p><b>Total of {total} exercises</b></p>
      </div>
    )
  }

const Course = (props) => {
    return (
      <div>
        {props.courses.map(course =>
          <li key={course.id} type="none">
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </li>
        )}
      </div>
    )
  }
 
export default Course