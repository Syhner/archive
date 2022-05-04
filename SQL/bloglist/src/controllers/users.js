const router = require('express').Router();

const { Blog, User } = require('../models');

const userFinder = async (req, res, next) => {
  const { id, username } = req.params;

  let foundUser;

  if (id) {
    foundUser = await User.findByPk(req.params.id);
  } else if (username) {
    foundUser = await User.findOne({ where: { username } });
  }

  if (!foundUser) {
    return res.status(404).end();
  }

  req.foundUser = foundUser;
  next();
};

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: { model: Blog, attributes: { exclude: ['userId'] } },
  });

  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get('/:id', userFinder, async (req, res) => {
  let where = {};

  if (req.query.read === 'true') {
    where.read = true;
  } else if (req.query.read === 'false') {
    where.read = false;
  }

  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['id', 'read'],
        where,
      },
    },
  });

  if (!user) {
    return res.status(404).end();
  }

  res.json(user);
});

router.put('/:username', userFinder, async (req, res) => {
  const { foundUser } = req;

  foundUser.username = req.body.username;
  const updatedUser = await foundUser.save();
  res.json(updatedUser);
});

module.exports = router;
