const mongoose = require('mongoose');
const Person = require('./models/Person');

const args = process.argv;
const argsLength = args.length;

// Incorrect usage
if (argsLength !== 3 && argsLength !== 5) {
  console.log('Incorrect usage!');
  console.log('\nUse: node mongo.js <mongo-password>');
  console.log('To display all phonebook entries');
  console.log('\nUse: node mongo.js <mongo-password> <name> <number>');
  console.log('To add a person to the phonebook');
  process.exit(1);
}

const password = args[2];
const url = `mongodb+srv://syhner:${password}@fullstackopen.iuc1h.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

if (argsLength === 3) {
  Person.find({}).then(res => {
    console.log('phonebook:');
    res.forEach(({ name, number }) => {
      console.log(name, number);
    });
    mongoose.connection.close();
  });
} else if (argsLength === 5) {
  const name = args[3];
  const number = args[4];

  const person = new Person({ name, number });

  person.save().then(res => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
