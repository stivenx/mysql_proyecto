const express = require('express');
const router = express.Router();
const {crearDocumento,obtenerDocumentos,upload,actualizarDocumento,obtenerDocumentoPorId,eliminardocumentos } = require('../controllers/coumentsController');


router.post('/',upload.array("imagenes", 10), crearDocumento);
router.get('/', obtenerDocumentos);
router.patch('/:id',upload.array("imagenes", 10), actualizarDocumento);
router.get('/:id', obtenerDocumentoPorId);
router.delete('/:id', eliminardocumentos);



module.exports = router;