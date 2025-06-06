const pool = require("../dbConfig/db"); // Conexión a MySQL

// 1️⃣ Obtener el carrito de un usuario
exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const [cart] = await pool.query(
            `SELECT c.id_carrito, cp.id AS id_carrito_producto, p.id AS id_producto, p.nombre, p.precio, cp.cantidad, p.imagen,p.discount
             FROM carrito_productos cp
             JOIN productos p ON cp.id_producto = p.id
             JOIN carrito c ON cp.id_carrito = c.id_carrito
             WHERE c.id_usuario = ?`, 
            [userId]
        );

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el carrito" });
    }
};



// 2️⃣ Agregar un producto al carrito con verificación de stock
exports.addToCart = async (req, res) => {
    const { userId, id_producto, cantidad } = req.body;

    try {
        // Verificar el stock disponible
        const [product] = await pool.query("SELECT cantidad_disponible FROM productos WHERE id = ?", [id_producto]);

        if (product.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (product[0].cantidad_disponible < cantidad) {
            return res.status(400).json({ message: "Stock insuficiente" });
        }
        

        // Verificar si el usuario ya tiene un carrito
        const [existingCart] = await pool.query("SELECT id_carrito FROM carrito WHERE id_usuario = ?", [userId]);

        let cartId;
        if (existingCart.length === 0) {
            // Si el carrito no existe, crearlo
            const [newCart] = await pool.query("INSERT INTO carrito (id_usuario) VALUES (?)", [userId]);
            cartId = newCart.insertId;
        } else {
            cartId = existingCart[0].id_carrito;
        }

        // Verificar si el producto ya está en el carrito
        const [existingProduct] = await pool.query(
            "SELECT cantidad FROM carrito_productos WHERE id_carrito = ? AND id_producto = ?", 
            [cartId, id_producto]
        );

        if (existingProduct.length > 0) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            await pool.query(
                "UPDATE carrito_productos SET cantidad = cantidad + ? WHERE id_carrito = ? AND id_producto = ?", 
                [cantidad, cartId, id_producto]
            );
        } else {
            // Si no está en el carrito, agregarlo
            await pool.query(
                "INSERT INTO carrito_productos (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)", 
                [cartId, id_producto, cantidad]
            );
        }

        // Restar la cantidad agregada del stock
        await pool.query(
            "UPDATE productos SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?", 
            [cantidad, id_producto]
        );

        res.json({ message: "Producto agregado al carrito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar producto al carrito" });
    }
};

// 3️⃣ Actualizar la cantidad de un producto en el carrito
exports.updateCartItem = async (req, res) => {
    const { id_carrito, id_producto, nuevaCantidad } = req.body;

    try {
        // Obtener la cantidad actual en el carrito
        const [currentItem] = await pool.query(
            "SELECT cantidad FROM carrito_productos WHERE id_carrito = ? AND id_producto = ?", 
            [id_carrito, id_producto]
        );

        if (currentItem.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        const cantidadActual = currentItem[0].cantidad;

        // Si la cantidad se reduce, devolver la diferencia al stock
        if (nuevaCantidad < cantidadActual) {
            const cantidadDevuelta = cantidadActual - nuevaCantidad;
            await pool.query(
                "UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?", 
                [cantidadDevuelta, id_producto]
            );
        } else {
            // Si la cantidad aumenta, verificar si hay suficiente stock
            const cantidadExtra = nuevaCantidad - cantidadActual;
            const [product] = await pool.query("SELECT cantidad_disponible FROM productos WHERE id = ?", [id_producto]);

            if (product[0].cantidad_disponible < cantidadExtra) {
                return res.status(400).json({ message: "Stock insuficiente" });
            }

            // Restar la cantidad extra del stock
            await pool.query(
                "UPDATE productos SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?", 
                [cantidadExtra, id_producto]
            );
        }

        // Actualizar la cantidad en el carrito
        await pool.query(
            "UPDATE carrito_productos SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?", 
            [nuevaCantidad, id_carrito, id_producto]
        );

        res.json({ message: "Cantidad actualizada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar cantidad" });
    }
};

// 4️⃣ Eliminar un producto del carrito y devolver stock
exports.removeFromCart = async (req, res) => {
    let { id_carrito, id_producto } = req.params;

    // Convertir a número para evitar errores SQL
    id_carrito = Number(id_carrito);
    id_producto = Number(id_producto);

    if (!id_carrito || !id_producto) {
        return res.status(400).json({ message: "ID de carrito o producto inválido" });
    }

    try {
        // Obtener la cantidad antes de eliminarlo
        const [rows] = await pool.query(
            "SELECT cantidad FROM carrito_productos WHERE id_carrito = ? AND id_producto = ?", 
            [id_carrito, id_producto]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        const cantidadDevuelta = rows[0].cantidad;

        // Eliminar el producto del carrito
        const [deleteResult] = await pool.query(
            "DELETE FROM carrito_productos WHERE id_carrito = ? AND id_producto = ?", 
            [id_carrito, id_producto]
        );

        if (deleteResult.affectedRows === 0) {
            return res.status(500).json({ message: "No se pudo eliminar el producto del carrito" });
        }

        // Devolver la cantidad eliminada al stock
        const [updateResult] = await pool.query(
            "UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?", 
            [cantidadDevuelta, id_producto]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(500).json({ message: "No se pudo actualizar el stock del producto" });
        }

        res.json({ message: "Producto eliminado del carrito y stock actualizado correctamente" });
    } catch (error) {
        console.error("Error en removeFromCart:", error);
        res.status(500).json({ message: "Error al eliminar producto del carrito" });
    }
};


// 5️⃣ Vaciar el carrito y devolver el stock
exports.clearCart = async (req, res) => {
    const { id_carrito } = req.params;

    try {
        // Obtener todos los productos en el carrito
        const [cartItems] = await pool.query(
            "SELECT id_producto, cantidad FROM carrito_productos WHERE id_carrito = ?", 
            [id_carrito]
        );

        if (cartItems.length === 0) {
            return res.status(404).json({ message: "El carrito ya está vacío" });
        }

        // Devolver el stock de cada producto en el carrito
        for (const item of cartItems) {
            await pool.query(
                "UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?", 
                [item.cantidad, item.id_producto]
            );
        }

        // Eliminar todos los productos del carrito
        await pool.query("DELETE FROM carrito_productos WHERE id_carrito = ?", [id_carrito]);

        res.json({ message: "Carrito vaciado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al vaciar el carrito" });
    }
};
