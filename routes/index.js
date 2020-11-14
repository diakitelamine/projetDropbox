const router = require('express').Router();
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.get('/',  (req, res) => {
  res.render('index');
});

module.exports = router;