const express = require('express');
const router = express.Router();
const {getAllProducts,createProduct,updateProduct,deleteProduct, getProductById, searchProducts,productsFilterPrice,productsByCategoria,upload,getProductsCategoryType,getTypeCountsByCategory,getAllProductsNews   } = require('../controllers/productsControllers');


router.get('/', getAllProducts);
router.get('/news', getAllProductsNews);
router.get('/categoria/:id', productsByCategoria);
router.post('/',upload.array("imagenes", 5), createProduct);
router.patch('/:id',upload.array("imagenes", 5), updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id', getProductById);
router.get('/search/:nombre', searchProducts);
router.get('/filter/:min/:max', productsFilterPrice);
router.get('/category/:categoryId/type/:typeId', getProductsCategoryType);
router.get('/category/:categoryId/type-counts', getTypeCountsByCategory);


module.exports = router;