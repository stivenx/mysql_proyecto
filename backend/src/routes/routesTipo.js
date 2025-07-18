const express = require('express');
const router = express.Router();
const {getAllTypes ,createType,updateType,deleteType, getTypeById} = require('../controllers/tipoController');



router.get('/', getAllTypes);
router.post('/', createType);
router.patch('/:id', updateType);
router.delete('/:id', deleteType);
router.get('/:id', getTypeById);

module.exports = router;