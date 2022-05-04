const { Session, User } = require('../models');

const isUserDisabled = async user => {
  const foundUser = await User.findByPk(user.id);
  if (foundUser?.disabled === true) {
    return true;
  }
  return false;
};

const isTokenInSessions = async (user, token) => {
  const foundSession = await Session.findOne({
    where: { userId: user.id, token },
  });
  console.log(foundSession);
  if (foundSession) {
    return true;
  } else {
    return false;
  }
};

const isLogged = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' });
  }
  if (!req.user) {
    return res.status(401).json({ error: 'token invalid' });
  }
  if (await isUserDisabled(req.user)) {
    return res.status(403).json({ error: 'account disabled, contact admin' });
  }
  if (!(await isTokenInSessions(req.user, req.token))) {
    return res.status(401).json({ error: 'token expired, log back in ' });
  }

  next();
};

module.exports = isLogged;
