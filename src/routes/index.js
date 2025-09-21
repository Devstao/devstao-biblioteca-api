const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes')

const livroRotas = require('./livroRotas');

router.use('/livros', livroRotas);
router.use('/auth',userRoutes);

module.exports = router;