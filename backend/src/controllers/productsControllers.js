const pool = require('../dbConfig/db');
const multer = require ("multer");
const path = require ("path");
const fs = require("fs");
const e = require('express');
// Almacenamiento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../products")),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

exports.upload = multer({ storage });







exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.nombre AS categoria_nombre,t.nombre AS tipo_nombre ,ip.nombre_archivo
      FROM productos p
       JOIN categoria c ON p.categoria = c.id
       left JOIN tipo t ON p.tipo = t.id
      LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
      ORDER BY p.id, ip.id
    `);

    const mapProducts = {};

    for (const product of products) {
      if (!mapProducts[product.id]) {
        mapProducts[product.id] = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad_disponible: product.cantidad_disponible,
          categoria: product.categoria,
          tipo: product.tipo,
          tipo_nombre: product.tipo_nombre,
          discount: product.discount,
          categoria_nombre: product.categoria_nombre,
          etiqueta: product.etiqueta,
          imagenes: [],
        };
      }
      if (product.nombre_archivo) {
        mapProducts[product.id].imagenes.push(product.nombre_archivo);
      }
    }

    const productsWithImages = Object.values(mapProducts);
    res.status(200).json(productsWithImages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [product] = await pool.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre, 
        t.nombre AS tipo_nombre,
        ip.nombre_archivo
      FROM productos p
       JOIN categoria c ON p.categoria = c.id
       left JOIN tipo t ON p.tipo = t.id
      LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
      WHERE p.id = ?
    `, [id]);

    if (product.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const productData = {
      id: product[0].id,
      nombre: product[0].nombre,
      precio: product[0].precio,
      cantidad_disponible: product[0].cantidad_disponible,
      categoria: product[0].categoria,
      tipo: product[0].tipo,
      tipo_nombre: product[0].tipo_nombre,
      discount: product[0].discount,
      categoria_nombre: product[0].categoria_nombre,
      etiqueta: product[0].etiqueta,
      imagenes:[],
    };

    for (const row of product) {
      if (row.nombre_archivo) {
        productData.imagenes.push(row.nombre_archivo);
      }
    }

    res.status(200).json(productData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

  exports.searchProducts = async (req, res) => {
  try {
    const { nombre } = req.params;
    
    const [products] = await pool.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre, 
        t.nombre AS tipo_nombre,
        ip.nombre_archivo
      FROM productos p
      JOIN categoria c ON p.categoria = c.id
      JOIN tipo t ON p.tipo = t.id
      LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
      WHERE LOWER(p.nombre) LIKE LOWER(?)
    `, [`%${nombre}%`]);

    const mapProducts = {};

    for (const product of products) {
      if (!mapProducts[product.id]) {
        mapProducts[product.id] = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad_disponible: product.cantidad_disponible,
          categoria: product.categoria,
          tipo: product.tipo,
          tipo_nombre: product.tipo_nombre,
          discount: product.discount,
          categoria_nombre: product.categoria_nombre,
          etiqueta: product.etiqueta,
          imagenes: [],
        };
      }
      if (product.nombre_archivo) {
        mapProducts[product.id].imagenes.push(product.nombre_archivo);
      }
    }

    const productsWithImages = Object.values(mapProducts);

    res.status(200).json(productsWithImages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar los productos' });
  }
};


 exports.productsByCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre, 
        t.nombre AS tipo_nombre,
        ip.nombre_archivo
      FROM productos p
      JOIN categoria c ON p.categoria = c.id
      JOIN tipo t ON p.tipo = t.id
      LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
      WHERE p.categoria = ?
      ORDER BY p.id, ip.id
    `, [id]);

    const mapProducts = {};

    for (const product of products) {
      if (!mapProducts[product.id]) {
        mapProducts[product.id] = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad_disponible: product.cantidad_disponible,
          categoria: product.categoria,
          tipo: product.tipo,
          tipo_nombre: product.tipo_nombre,
          discount: product.discount,
          categoria_nombre: product.categoria_nombre,
          etiqueta: product.etiqueta,
          imagenes: [],
        };
      }
      if (product.nombre_archivo) {
        mapProducts[product.id].imagenes.push(product.nombre_archivo);
      }
    }

    const productsWithImages = Object.values(mapProducts);
    res.status(200).json(productsWithImages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos por categoría' });
  }
};

  
 exports.productsFilterPrice = async (req, res) => {
  try {
    const { min, max } = req.params;
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);

    // Validaciones
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ error: 'Los precios deben ser números válidos' });
    }
    if (minPrice > maxPrice) {
      return res.status(400).json({ error: 'El precio mínimo debe ser menor que el precio máximo' });
    }
    if (minPrice < 0 || maxPrice < 0) {
      return res.status(400).json({ error: 'Los precios no pueden ser negativos' });
    }

    // Consulta con JOINs
    const [products] = await pool.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre, 
        t.nombre AS tipo_nombre,
        ip.nombre_archivo
      FROM productos p
      JOIN categoria c ON p.categoria = c.id
      left JOIN tipo t ON p.tipo = t.id
      LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
      WHERE p.precio BETWEEN ? AND ?
      ORDER BY p.precio ASC
    `, [minPrice, maxPrice]);

    // Agrupación de productos por ID
    const mapProducts = {};
    for (const product of products) {
      if (!mapProducts[product.id]) {
        mapProducts[product.id] = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad_disponible: product.cantidad_disponible,
          categoria: product.categoria,
          tipo: product.tipo ,
          tipo_nombre: product.tipo_nombre,
          discount: product.discount,
          etiqueta: product.etiqueta,
          categoria_nombre: product.categoria_nombre,
          imagenes: [],
        };
      }
      if (product.nombre_archivo) {
        mapProducts[product.id].imagenes.push(product.nombre_archivo);
      }
    }

      const productsWithImages = Object.values(mapProducts).sort(
      (a, b) => a.precio - b.precio
    );

    res.status(200).json(productsWithImages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al filtrar los productos por precio' });
  }
};

exports.createProduct = async (req, res) => {
  try { 
    const { nombre, precio, cantidad_disponible, categoria, tipo,discount } = req.body;
    const imagenes = req.files || [];

    // Validación de campos obligatorios
    if (!nombre || !precio || !cantidad_disponible || !categoria || !tipo) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({ message: 'El descuento debe estar entre 0 y 100' });
    }

    // Verificar si la categoría existe
    const [categoryValid] = await pool.query('SELECT * FROM categoria WHERE id = ?', [categoria]);  
    if (categoryValid.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    const [tipoValid] = await pool.query('SELECT * FROM tipo WHERE id = ?', [tipo]);
    if (tipoValid.length === 0) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }

    let productId;

    // Verificar si el producto ya existe
    const [existingProduct] = await pool.query('SELECT * FROM productos WHERE nombre = ?', [nombre]);
    if (existingProduct.length > 0) {
      await pool.query(
        'UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?',
        [cantidad_disponible, existingProduct[0].id]
      );
      productId = existingProduct[0].id;
    } else {
      const [result] = await pool.query(
        'INSERT INTO productos (nombre, precio, cantidad_disponible, categoria,tipo ,discount) VALUES (?, ?, ?, ?, ?, ?)', 
        [nombre, precio, cantidad_disponible, categoria, tipo,discount]
      );
      productId = result.insertId;
    }

    // Guardar imágenes en la tabla imagenes_productos
    for (const file of imagenes) {
      await pool.query(
        'INSERT INTO imagenes_productos (producto_id, nombre_archivo) VALUES (?, ?)',
        [productId,  `products/${file.filename}`]
      );
    }

    res.status(201).json({ message: 'Producto creado correctamente', id: productId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};




exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, precio, cantidad_disponible, categoria,tipo ,discount, imagenesConservar,etiqueta  } = req.body;
    const camposActualizados = [];
    const valores = [];

    if (nombre) {
      camposActualizados.push("nombre = ?");
      valores.push(nombre);
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
    if (tipo) {
      camposActualizados.push("tipo = ?");
      valores.push(tipo);
    }
    if (discount !== undefined) {
      if (discount < 0 || discount > 100) {
        return res.status(400).json({ message: 'El descuento debe estar entre 0 y 100' });
      }
      camposActualizados.push("discount = ?");
      valores.push(discount);
    }
    if(etiqueta){
      camposActualizados.push("etiqueta = ?");
      valores.push(etiqueta || null);
    }

    if (camposActualizados.length > 0) {
      valores.push(id);
      const [result] = await pool.query(
        `UPDATE productos SET ${camposActualizados.join(', ')} WHERE id = ?`,
        valores
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
    } 

    // Asegurar que imagenesConservadas es array
    if (!Array.isArray(imagenesConservar)) {
      imagenesConservar = imagenesConservar ? [imagenesConservar] : [];
    }
  


    // Obtener imágenes actuales
    const [imagenesActuales] = await pool.query(
      'SELECT nombre_archivo FROM imagenes_productos WHERE producto_id = ?',
      [id]
    );

    const imagenesAConservar = new Set(imagenesConservar || []);
    const imagenesAEliminar = imagenesActuales.filter(
      img => !imagenesAConservar.has(img.nombre_archivo)
    );

    // Eliminar imágenes del disco y de la base de datos
    for (const imagen of imagenesAEliminar) {
      const ruta = path.join(__dirname, "../../", imagen.nombre_archivo);
      if (fs.existsSync(ruta)) {
        fs.unlinkSync(ruta);
      }
      await pool.query(
        'DELETE FROM imagenes_productos WHERE producto_id = ? AND nombre_archivo = ?',
        [id, imagen.nombre_archivo]
      );
    }

    // Agregar nuevas imágenes si existen
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          'INSERT INTO imagenes_productos (producto_id, nombre_archivo) VALUES (?, ?)',
          [id, `products/${file.filename}`]
        );
      }
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

    // Obtener imágenes asociadas al producto
    const [imagenes] = await pool.query(
      'SELECT nombre_archivo FROM imagenes_productos WHERE producto_id = ?',
      [id]
    );
    
    const [comentarios] = await pool.query(
      'SELECT id FROM comentarios_productos WHERE  id_producto = ?',
      [id]
    )
    // Eliminar archivos físicos
    for (const imagen of imagenes) {
      const ruta = path.join(__dirname, "../../", imagen.nombre_archivo);
      if (fs.existsSync(ruta)) {
        await fs.promises.unlink(ruta);
      }
    }

    for (const comentario of comentarios) {
     const [imagenesComentarios] = await pool.query('select * FROM imagenes_comentarios WHERE comment_id = ?', [comentario.id]);

      for (const imagen of imagenesComentarios) {
        const ruta = path.join(__dirname, "../../", imagen.nombre_archivo);
        if (fs.existsSync(ruta)) {
          await fs.promises.unlink(ruta);
        }
      }

     
    }


    // Eliminar producto (esto eliminará también los registros en imagenes_productos por ON DELETE CASCADE)
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


exports.getProductsCategoryType = async (req, res) => {
  const { categoryId, typeId } = req.params;

  try {
    const [products] = await pool.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria_nombre, 
        t.nombre AS tipo_nombre, 
        ip.nombre_archivo
      FROM productos p
      JOIN categoria c ON p.categoria = c.id
      LEFT JOIN tipo t ON p.tipo = t.id
      LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
      WHERE p.categoria = ? AND p.tipo = ?
      ORDER BY p.id, ip.id
    `, [categoryId, typeId]); // ✅ parámetros seguros

    const mapProducts = {};

    for (const product of products) {
      if (!mapProducts[product.id]) {
        mapProducts[product.id] = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad_disponible: product.cantidad_disponible,
          categoria: product.categoria,
          tipo: product.tipo,
          tipo_nombre: product.tipo_nombre,
          discount: product.discount,
          categoria_nombre: product.categoria_nombre,
          etiqueta: product.etiqueta,
          imagenes: [],
        };
      }

      if (product.nombre_archivo) {
        mapProducts[product.id].imagenes.push(product.nombre_archivo);
      }
    }

    const productsWithImages = Object.values(mapProducts);
    res.status(200).json(productsWithImages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// controllers/productController.js

exports.getTypeCountsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT 
        t.id, 
        t.nombre, 
        COUNT(p.id) AS cantidad
      FROM tipo t
      LEFT JOIN productos p ON p.tipo = t.id AND p.categoria = ?
      GROUP BY t.id, t.nombre
    `, [categoryId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener conteo de tipos:", error);
    res.status(500).json({ error: "Error al obtener conteo de tipos" });
  }
};


exports.getAllProductsNews = async (req, res) => {
  try {
    const [products] = await pool.query(`
     SELECT 
      p.*, 
      c.nombre AS categoria_nombre, 
      t.nombre AS tipo_nombre, 
      ip.nombre_archivo
     FROM productos p
      JOIN categoria c ON p.categoria = c.id
     LEFT JOIN tipo t ON p.tipo = t.id
     LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
     Where p.etiqueta = 'Nuevo'
     ORDER BY p.fecha_creacion DESC, ip.id;

    `);

    const mapProducts = new Map();

  for (const product of products) {
    if (!mapProducts.has(product.id)) {
      mapProducts.set(product.id, {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad_disponible: product.cantidad_disponible,
        categoria: product.categoria,
        tipo: product.tipo,
        tipo_nombre: product.tipo_nombre,
        discount: product.discount,
        categoria_nombre: product.categoria_nombre,
        fecha_creacion: product.fecha_creacion,
        etiqueta: product.etiqueta,
        imagenes: [],
      });
    }
    if (product.nombre_archivo) {
      mapProducts.get(product.id).imagenes.push(product.nombre_archivo);
    }
  }

  const productsWithImages = Array.from(mapProducts.values());

    res.status(200).json(productsWithImages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};