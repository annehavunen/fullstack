const PersonForm = (props) => {
  const newName = props.newName
  const setNewName = props.setNewName
  const handleNameChange = props.handleNameChange
  const newNumber = props.newNumber
  const setNewNumber = props.setNewNumber
  const handleNumberChange = props.handleNumberChange
  const persons = props.persons
  const setPersons = props.setPersons

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
  }
    const names = persons.map(person => person.name)
    const exists = names.indexOf(nameObject.name)
    if (exists === -1) {
        setPersons(persons.concat(nameObject))
        setNewName('')
        setNewNumber('')
    } else {
        alert(`${newName} is already added to phonebook`)
    }
}

  return (
    <form onSubmit={addName}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div><button type='submit'>add</button></div>
  </form>
  )
}


export default PersonForm