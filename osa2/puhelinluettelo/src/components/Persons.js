
const Persons = ({persons}) => {
  return (
    <ul>{persons.map(person => <li key={person.name}>{person.name} {person.number}</li>)}</ul> 
  )
}

export default Persons

// const Person = ({person}) => {
//     return (
//         <li>{person.name} {person.number}</li>
//     )
    
// }
//<ul>{namesToShow.map(person => <Person key={person.name} person={person}/>)}</ul>

// <ul>{namesToShow.map(person => <li key={person.name}>{person.name} {person.number}</li>)}</ul>