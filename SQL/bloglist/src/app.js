const express = require('express');
require('express-async-errors');

const middleware = require('./middleware');
const blogs = require('./controllers/blogs');
const users = require('./controllers/users');
const login = require('./controllers/login');
const logout = require('./controllers/logout');
const authors = require('./controllers/authors');
const readingLists = require('./controllers/readinglists');

const app = express();

app.use(middleware.pre);

app.use('/api/blogs', blogs);
app.use('/api/users', users);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/authors', authors);
app.use('/api/readinglists', readingLists);

app.use(middleware.post);

module.exports = app;
