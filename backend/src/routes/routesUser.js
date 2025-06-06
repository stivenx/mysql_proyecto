const express = require('express');
const router = express.Router();
const {getAllUsers,register,login,updateUser,deleteUser, getUserById, searchUser } = require('../controllers/userControllers');


router.get('/', getAllUsers);
router.get('/search/:search', searchUser );
router.post('/register', register);
router.post('/login', login);
router.patch('/:iduser', updateUser);
router.delete('/:iduser', deleteUser);
router.get('/:iduser', getUserById);

module.exports = router;