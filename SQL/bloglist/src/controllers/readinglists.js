const router = require('express').Router();

const isLogged = require('../middleware/isLogged');
const { ReadingLists } = require('../models');

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;
  await ReadingLists.create({ blogId, userId });
  res.status(204).end();
});

router.put('/:id', isLogged, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  const readingList = await ReadingLists.findOne({ where: { blogId, userId } });

  if (!readingList) {
    return res.status(404).end();
  }

  if (req.body.read === true) {
    readingList.read = true;
  } else if (req.body.read === false) {
    readingList.read = false;
  }

  const savedReadingList = await readingList.save();
  res.json(savedReadingList);
});

module.exports = router;
