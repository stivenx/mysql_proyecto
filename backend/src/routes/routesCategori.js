const express = require('express');
const router = express.Router();
const {getAllCategories,createCategory,updateCategory,deleteCategory, getCategoryById} = require('../controllers/categoriaControllers');



router.get('/', getAllCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:id', getCategoryById);

module.exports = router;