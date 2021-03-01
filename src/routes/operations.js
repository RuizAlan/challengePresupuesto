const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('operations/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { tipo, concepto, monto, fecha } = req.body;
    const newOperation = {
        tipo,
        concepto,
        monto,
        fecha,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO operations set ?', [newOperation]);
    req.flash('message', 'Successful operation!');
    res.redirect('/');
});

router.get('/', isLoggedIn, async (req, res) => {
    const operations = await pool.query('SELECT * FROM operations WHERE user_id = ?', [req.user.id]);
    res.render('/', { operations });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM operations WHERE ID = ?', [id]);
    req.flash('message', 'Operation removed successfully!');
    res.redirect('/');
});

router.get('/edit/:id', isLoggedIn, async (req, res) =>{
    const { id } = req.params;
    const operations = await pool.query('SELECT * FROM operations WHERE ID = ?', [id]);
    res.render('operations/edit', { operation: operations [0]});
});

router.post('/edit/:id', isLoggedIn, async (req,res) => {
    const { id } = req.params;
    const { tipo, concepto, monto, fecha } = req.body;
    const newOperation = {
        tipo,
        concepto,
        monto,
        fecha
    };
    await pool.query('UPDATE operations set ? WHERE id = ?', [newOperation, id]);
    req.flash('message', 'Operation updated successfully!');
    res.redirect('/');
});

module.exports = router;