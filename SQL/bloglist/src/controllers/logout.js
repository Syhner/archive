const router = require('express').Router();

const isLogged = require('../middleware/isLogged');
const { Session } = require('../models');

router.delete('/', isLogged, async (req, res) => {
  await Session.destroy({ where: { userId: req.user.id } });
  res.status(204).end();
});

module.exports = router;
