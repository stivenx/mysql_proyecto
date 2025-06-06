const pool = require('../dbConfig/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT p.*, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categoria c ON p.categoria = c.id');
    
    
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

  exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const [product] = await pool.query('SELECT p.*, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categoria c ON p.categoria = c.id WHERE p.id = ?', [id]);
      if (product.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
    
      res.status(200).json(product[0],);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  };

  exports.searchProducts = async (req, res) => {
    try {
      const { nombre } = req.params;
      const [products] = await pool.query('SELECT p.*, c.nombre AS categoria_nombre FROM productos p  LEFT JOIN categoria c ON p.categoria = c.id WHERE lower (p.nombre) LIKE  lower(?)', [`%${nombre}%`]);
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al buscar los productos' });
    }
  };

  exports.productsByCategoria = async(req,res) =>{
   try {
    const  { id } = req.params;
    const [products] = await pool.query('SELECT p.*, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categoria c ON p.categoria = c.id WHERE p.categoria = ?', [id]);
    res.status(200).json(products);
   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos por categoría' });
    
   }

  }
  
  exports.productsFilterPrice = async (req, res) => {
    try {
      const { min, max } = req.params;
      const minPrice = parseFloat(min);
      const maxPrice = parseFloat(max);
      if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: 'Los precios deben ser números válidos' });
      }
      if(minPrice > maxPrice) {
        return res.status(400).json({ error: 'El precio mínimo debe ser menor que el precio máximo' });
      }
      if(minPrice < 0 || maxPrice < 0) {
        return res.status(400).json({ error: 'Los precios no pueden ser negativos' });
      }
      const [products] = await pool.query('SELECT p.*, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categoria c ON p.categoria = c.id WHERE p.precio BETWEEN ? AND ? ORDER BY p.precio ASC', [minPrice, maxPrice]);
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al filtrar los productos por precio' });
    }
  };
exports.createProduct = async (req, res) => {
  try { 
    const { nombre, imagen, precio, cantidad_disponible, categoria, discount } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !imagen || !precio || !cantidad_disponible || !categoria) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    if (discount < 0 || discount > 100) {
        return res.status(400).json({ message: 'El descuento debe estar entre 0 y 100' });
    }

    // Verificar si la categoría existe
    const [categoryvalid] = await pool.query('SELECT * FROM categoria WHERE id = ?', [categoria]);  
    if (categoryvalid.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    let productid;
    // si existe el producto
    const [existingProduct] = await pool.query('SELECT * FROM productos WHERE nombre = ?', [nombre]);
    if (existingProduct.length > 0) {
      await pool.query("UPDATE productos set cantidad_disponible = cantidad_disponible + ? where id = ?", [cantidad_disponible, existingProduct[0].id]);
      productid = existingProduct[0].id;
     
    }else {
        // Insertar producto en la base de datos
    const [result] = await pool.query(
      'INSERT INTO productos (nombre,  precio, cantidad_disponible, categoria, discount, imagen) VALUES (?, ?, ?, ?, ?, ?)', 
      [nombre, precio, cantidad_disponible, categoria, discount, imagen]
         );
         productid = result.insertId;
      }
    

    res.status(201).json({ message: 'Producto creado correctamente', id: productid });

} catch (error) {
    console.error(error);    
    res.status(500).json({ message: 'Error al crear el producto' });
}
};

exports.updateProduct = async (req, res) => {
  try {
      const { id } = req.params;
      const { nombre, imagen, precio, cantidad_disponible, categoria, discount } = req.body;
      const camposActualizados = [];
      const valores = [];

      if (nombre) {
          camposActualizados.push("nombre = ?");
          valores.push(nombre);
      }
      if (imagen) {
          camposActualizados.push("imagen = ?");
          valores.push(imagen);
      }
      if (precio) {
          camposActualizados.push("precio = ?");
          valores.push(precio);
      }
      if (cantidad_disponible) {
          camposActualizados.push("cantidad_disponible = ?");
          valores.push(cantidad_disponible);
      }
      if (categoria) {
          camposActualizados.push("categoria = ?");
          valores.push(categoria);
      }
      if (discount !== undefined) {  // Permite `0` como valor válido
          if (discount < 0 || discount > 100) {
              return res.status(400).json({ message: 'El descuento debe estar entre 0 y 100' });
          }
          camposActualizados.push("discount = ?");
          valores.push(discount);
      }

      if (camposActualizados.length === 0) {
          return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
      }

      valores.push(id);
      const [result] = await pool.query(`UPDATE productos SET ${camposActualizados.join(', ')} WHERE id = ?`, valores);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.status(200).json({ message: 'Producto actualizado correctamente' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};


 exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });    
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

