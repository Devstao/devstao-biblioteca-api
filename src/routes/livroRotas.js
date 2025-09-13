const express = require('express');
const LivroController = require('../controllers/livroController');

const router = express.Router();

router.get('/', LivroController.getLivros);
router.get('/:id', LivroController.getLivroById);
router.post('/', LivroController.createLivro);
router.put('/:id', LivroController.updateLivro);
router.delete('/', LivroController.deleteLivro);

module.exports = router;