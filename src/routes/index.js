var express = require('express');
var router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

/* GET home page. */
router.get('/', isLoggedIn, async (req, res) => {
  const operations = await pool.query('SELECT * FROM operations WHERE user_id = ?', [req.user.id]);
  res.render('index', { operations });
});

module.exports = router;
