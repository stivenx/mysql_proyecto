const express = require('express');
const router = express.Router();
const {getCart,addToCart,removeFromCart,updateCartItem,clearCart} = require('../controllers/carritoController');


// 1️⃣ Obtener el carrito de un usuario
router.get("/user/:userId", getCart);

// 2️⃣ Agregar un producto al carrito (verifica stock)
router.post("/add", addToCart);

// 3️⃣ Actualizar la cantidad de un producto en el carrito
router.put("/update", updateCartItem);

// 4️⃣ Eliminar un producto del carrito (devuelve stock)
router.delete("/remove/:id_carrito/:id_producto", removeFromCart);

// 5️⃣ Vaciar el carrito (devuelve stock de todos los productos)
router.delete("/clear/:id_carrito", clearCart);

module.exports = router;