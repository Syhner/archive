const Blog = require('./Blog');
const User = require('./User');
const ReadingLists = require('./ReadingLists');
const Session = require('./Session');

Blog.belongsTo(User);
User.hasMany(Blog);

Blog.belongsToMany(User, { through: ReadingLists, as: 'users_marked' });
User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' });

Session.belongsTo(User);
User.hasMany(Session);

module.exports = {
  Blog,
  User,
  ReadingLists,
  Session,
};
