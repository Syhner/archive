import personsService from '../services/persons';

const PersonForm = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  persons,
  setPersons,
  setNotification,
}) => {
  const handleNameChange = e => {
    setNewName(e.target.value);
  };

  const handleNumberChange = e => {
    setNewNumber(e.target.value);
  };

  const clearNotification = () => {
    setTimeout(() => {
      setNotification({ message: null });
    }, 5000);
  };

  const createPerson = e => {
    e.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const newPerson = { name: newName, number: newNumber };
        personsService
          .update(existingPerson.id, newPerson)
          .then(updatedPerson => {
            setPersons(
              persons.map(p => (p.id === existingPerson.id ? updatedPerson : p))
            );
            setNotification({
              message: `Updated number for ${newName}`,
              type: 'success',
            });
            clearNotification();
          })
          .catch(err => {
            console.log(err);
            setNotification({
              message:
                err.response.data.message ||
                `Information of ${newName} has already been removed from server`,
              type: 'error',
            });
            clearNotification();
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotification({ message: `Added ${newName}`, type: 'success' });
          clearNotification();
        })
        .catch(err => {
          console.error(err);
          setNotification({
            message:
              err.response.data.message ||
              `An error occurred while adding that person to the phonebook`,
            type: 'error',
          });
          clearNotification();
        });
    }
  };

  return (
    <form onSubmit={createPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
