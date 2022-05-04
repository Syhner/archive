const router = require('express').Router();

const notes = require('../routes/notes');

router.use('/notes', notes);

module.exports = router;
