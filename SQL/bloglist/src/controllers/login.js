const jwt = require('jsonwebtoken');
const router = require('express').Router();

const { JWT_SECRET } = require('../util/config');
const { User, Session } = require('../models');

router.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === 'secret';

  if (!user || !passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, JWT_SECRET);

  await Session.create({ userId: user.id, token });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;