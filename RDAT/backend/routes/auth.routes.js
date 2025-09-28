const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.post('/login', usuarioController.login);
router.get('/usuarios', usuarioController.list);
router.post('/usuarios', usuarioController.add);
router.delete('/usuarios/:id', usuarioController.delete);

module.exports = router;