const express = require('express');
const router = express.Router();
const {crearComentario,obtenerComentariosPorProducto,editarComentario,eliminarComentario,upload    } = require('../controllers/productCommentController');


router.get('/:id_producto', obtenerComentariosPorProducto);
router.post('/',upload.array("imagenes", 5), crearComentario);
router.patch('/:id',upload.array("imagenes", 5), editarComentario);
router.delete('/:id', eliminarComentario);


module.exports = router;