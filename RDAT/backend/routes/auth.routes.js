const express = require('express');
const router = express.Router();
const usersController = require('../models/users');

router.post('/login', usersController.login);
router.get('/usuarios', usersController.list);
router.post('/usuarios', usersController.add);
router.delete('/usuarios/:id', usersController.delete);

module.exports = router;