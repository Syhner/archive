const { UserInputError, AuthenticationError } = require('apollo-server');
const { v1: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');

const { JWT_SECRET } = require('./utils/config');
require('./utils/db');
const Author = require('./models/Author');
const Book = require('./models/book');
const User = require('./models/User');

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const { author, genre } = args;
      let filteredBooks = await Book.find({}).populate('author');
      if (author) {
        filteredBooks = filteredBooks.filter(
          book => book.author.name === author
        );
      }
      if (genre) {
        filteredBooks = filteredBooks.filter(book =>
          book.genres.includes(genre)
        );
      }
      return filteredBooks;
    },
    allAuthors: async () => Author.find({}).populate('books'),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: root => root.books.length,
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const { author } = args;
      const foundAuthor = await Author.findOne({ name: author });
      let bookAuthor = foundAuthor;

      try {
        if (!foundAuthor) {
          newAuthor = new Author({ name: author, id: uuid() });
          bookAuthor = await newAuthor.save();
        }

        // Add book, add author to book
        const newBook = new Book({ ...args, id: uuid(), author: bookAuthor });
        await newBook.save();

        // Add book to author
        bookAuthor.books = bookAuthor.books.concat(newBook);
        await bookAuthor.save();

        pubsub.publish('BOOK_ADDED', { bookAdded: newBook });
        return newBook;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const { name, setBornTo } = args;

      const foundAuthor = await Author.findOne({ name });
      if (!foundAuthor) return null;

      foundAuthor.born = setBornTo;

      const updatedAuthor = await foundAuthor.save();
      return updatedAuthor;
    },
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args;
      const user = new User({ username, favoriteGenre });

      return user.save().catch(error => {
        throw new UserInputError(error.message, { invalidArgs: args });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      // Could implement password verification here
      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']) },
  },
};

module.exports = resolvers;
