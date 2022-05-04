const Person = require('../models/Person');

const getAll = () => Person.find({});

const getById = id => Person.findById(id);

const create = ({ name, number }) => {
  return Person.findOne({ name }).then(foundPerson => {
    if (foundPerson) {
      return Promise.reject({ name: 'DuplicateNameError' });
    }

    const newPerson = new Person({ name, number });
    return newPerson.save();
  });
};

const update = (id, number) => {
  return Person.findByIdAndUpdate(
    id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  );
};

const remove = id => Person.findByIdAndDelete(id);

const methods = { getAll, getById, create, update, remove };

module.exports = methods;
