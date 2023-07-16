import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'


const Display = ({ countries, clickCountry }) => {
  const [capital, setCapital] = useState('')
  const [area, setArea] = useState('')
  const [languages, setLanguages] = useState([])
  const [flag, setFlag] = useState(null)

  useEffect(() => {
    if (countries.length === 1) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countries[0].name.common}`)
        .then(response => {
          setCapital(response.data.capital)
          setArea(response.data.area)
          const languageList = Object.values(response.data.languages)
          setLanguages(languageList)
          setFlag(response.data.flags.png)
      })
    }
  }, [countries])

  if (countries.length === 1) {
    return (
      <Country 
        name={countries[0].name.common}
        capital={capital}
        area={area}
        languages={languages}
        flag={flag}>
      </Country>
    )
  }

  else if (countries.length <= 10) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => clickCountry(country)}>show</button>
          </li>
        ))}
      </ul>
    )
  }

  else {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
}

const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    if (newFilter) {
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().includes(newFilter.toLowerCase())
          )
          setCountries(filteredCountries)
        })
      }
      else {
        setCountries([])
      }
  }, [newFilter])

  const handleChange = event => {
    setNewFilter(event.target.value)
  }

  const clickCountry = (country) => {
    setCountries([country])
  }

  return (
    <div>
      <form>
        find countries <input value={newFilter} onChange={handleChange} />
      </form>
      <Display countries={countries} clickCountry={clickCountry}></Display>
    </div>
  )
}


export default App;
