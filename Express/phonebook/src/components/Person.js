import personsService from '../services/persons';

const Person = ({ person, persons, setPersons }) => {
  const handleDelete = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(person.id).then(() => {
        setPersons(persons.filter(p => p.id !== person.id));
      });
    }
  };

  return (
    <li>
      {person.name} {person.number}{' '}
      <button onClick={() => handleDelete(person)}>delete</button>
    </li>
  );
};

export default Person;
