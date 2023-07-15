const Country = ({ name, capital, area, languages, flag }) => {
    return (
      <div>
        <h1>{name}</h1>
        <p>capital {capital}</p>
        <p>area {area}</p>
        <h3>languages:</h3>
        <ul>
          {languages.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={flag} style={{ width: '200px', height: 'auto' }} />
      </div>
    )
  }
  
  
  export default Country
