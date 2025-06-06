const express = require('express');
const router = express.Router();
const {getAllProducts,createProduct,updateProduct,deleteProduct, getProductById, searchProducts,productsFilterPrice,productsByCategoria  } = require('../controllers/productsControllers');


router.get('/', getAllProducts);
router.get('/categoria/:id', productsByCategoria);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id', getProductById);
router.get('/search/:nombre', searchProducts);
router.get('/filter/:min/:max', productsFilterPrice);

module.exports = router;