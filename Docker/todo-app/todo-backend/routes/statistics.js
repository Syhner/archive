const router = require('express').Router();
const { getAsync } = require('../redis');

router.get('/', async (_req, res) => {
  const addedTodos = await getAsync('addedTodos');

  if (addedTodos === null) {
    res.send({ added_todos: 0 });
  } else {
    res.send({ added_todos: parseInt(addedTodos) });
  }
});

module.exports = router;
