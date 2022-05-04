const router = require('express').Router();
const { Op } = require('sequelize');

const isLogged = require('../middleware/isLogged');
const { Blog, User } = require('../models');

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return res.status(404).end();
  }

  req.blog = blog;
  next();
};

const isOwnBlog = (req, res, next) => {
  const { blog, user } = req;

  if (blog.userId !== user.id) {
    return res.status(403).end();
  }
  next();
};

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search.toLowerCase()}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search.toLowerCase()}%`,
          },
        },
      ],
    };
  }

  const allBlogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });

  res.json(allBlogs);
});

router.get('/:id', blogFinder, async (req, res) => {
  const { blog } = req;
  res.json(blog);
});

router.post('/', isLogged, async (req, res) => {
  const { user } = req;
  const newBlog = await Blog.create({ ...req.body, userId: user.id });
  res.json(newBlog);
});

router.put('/:id', isLogged, blogFinder, isOwnBlog, async (req, res) => {
  const { blog } = req;

  blog.likes = req.body.likes;
  const savedBlog = await blog.save();
  res.json(savedBlog);
});

router.delete('/:id', isLogged, blogFinder, isOwnBlog, async (req, res) => {
  const { blog } = req;
  await blog.destroy();
  res.status(204).end();
});

module.exports = router;
