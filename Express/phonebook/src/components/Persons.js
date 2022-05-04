import Person from './Person';

const Persons = ({ persons, setPersons, filter }) => {
  const personsFiltered = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {personsFiltered.map(person => (
        <Person
          key={person.id}
          person={person}
          persons={persons}
          setPersons={setPersons}
        />
      ))}
    </div>
  );
};

export default Persons;
