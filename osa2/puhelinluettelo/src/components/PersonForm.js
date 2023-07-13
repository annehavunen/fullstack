import phonebookService from '../services/phonebook'


const PersonForm = (props) => {
  const newName = props.newName
  const setNewName = props.setNewName
  const handleNameChange = props.handleNameChange
  const newNumber = props.newNumber
  const setNewNumber = props.setNewNumber
  const handleNumberChange = props.handleNumberChange
  const persons = props.persons
  const setPersons = props.setPersons
  const setNotificationMessage = props.setNotificationMessage
  const setErrorMessage = props.setErrorMessage

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const names = persons.map(person => person.name)
    const exists = names.indexOf(nameObject.name)

    if (exists === -1) {
      phonebookService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationMessage(`Added ${newName}`)
        setTimeout(() => {setNotificationMessage(null)}, 5000)
        setNewName('')
        setNewNumber('')
      })

    } else if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)) {
      const existingPerson = persons.find(person => person.name === newName)
      const changedPerson = { ...existingPerson, number: newNumber }

      phonebookService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
          setNotificationMessage(`Changed ${newName}`)
          setTimeout(() => {setNotificationMessage(null)}, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {setErrorMessage(null)}, 5000)
          setPersons(persons.filter(p => p.name !== newName))
        })
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
