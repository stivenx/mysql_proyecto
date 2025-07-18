const pool = require('../dbConfig/db');
const multer = require ("multer");
const path = require ("path");
const fs = require("fs");
// Almacenamiento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../comments")),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

exports.upload = multer({ storage });




exports.crearComentario = async (req, res) => {
  const { id_producto, id_usuario, comentario, calificacion } = req.body;

  try {
    const [result] = await pool.query(`
      INSERT INTO comentarios_productos (id_producto, id_usuario, comentario, calificacion)
      VALUES (?, ?, ?, ?)
    `, [id_producto, id_usuario, comentario, calificacion]);

    if ( req.files && req.files.length > 0) {
      const imagenes = req.files.map((file) => file.filename);
      for (const nombreArchivo of imagenes) {
        await pool.query(`
          INSERT INTO imagenes_comentarios (comment_id, nombre_archivo)
          VALUES (?, ?)
        `, [result.insertId, `comments/${nombreArchivo}`]);
      }
    }

    res.status(201).json({ message: "Comentario creado correctamente", id: result.insertId });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error al crear comentario" });
  }
};

exports.obtenerComentariosPorProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const [comentarios] = await pool.query(`
      SELECT c.*, u.nombre AS nombre_usuario,ci.nombre_archivo
      FROM comentarios_productos c
      JOIN usuarios u ON c.id_usuario = u.iduser
      LEFT JOIN imagenes_comentarios ci ON c.id = ci.comment_id
      WHERE c.id_producto = ?
      ORDER BY c.fecha_comentario DESC
    `, [id_producto]);

    const commentMap = {};

    for (const comment of comentarios) {
      if (!commentMap[comment.id]) {
        commentMap[comment.id] = {
          id: comment.id,
          id_producto: comment.id_producto,
          id_usuario: comment.id_usuario,
          comentario: comment.comentario,
          calificacion: comment.calificacion,
          fecha_comentario: comment.fecha_comentario,
          nombre_usuario: comment.nombre_usuario,
          imagenes: [],
        };
      }

      if (comment.nombre_archivo) {
        commentMap[comment.id].imagenes.push(comment.nombre_archivo);
      }
    }

    const comentariosArray = Object.values(commentMap);
      

    res.status(200).json(comentariosArray);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

exports.editarComentario = async (req, res) => {
  const { id } = req.params;
  let { comentario, calificacion, imagenesConservadas } = req.body;

  try {
    await pool.query(`
      UPDATE comentarios_productos 
      SET comentario = ?, calificacion = ?
      WHERE id = ?
    `, [comentario, calificacion, id]);

    // Asegurar que imagenesConservadas es array
    if (!Array.isArray(imagenesConservadas)) {
      imagenesConservadas = imagenesConservadas ? [imagenesConservadas] : [];
    }

    console.log("➡️ Imágenes conservadas enviadas desde el frontend:");
    console.log(imagenesConservadas);

    const [imagenesActuales] = await pool.query(`
      SELECT nombre_archivo
      FROM imagenes_comentarios
      WHERE comment_id = ?
    `, [id]);

    console.log("📂 Imágenes actuales en la base de datos:");
    console.log(imagenesActuales.map(img => img.nombre_archivo));

    const imagenesAConservar = new Set(imagenesConservadas);
    const imagenesAEliminar = imagenesActuales.filter(img => !imagenesAConservar.has(img.nombre_archivo));

    console.log("🗑️ Imágenes que se eliminarán:");
    console.log(imagenesAEliminar.map(img => img.nombre_archivo));

    for (const img of imagenesAEliminar) {
      const rutaImagen = path.join(__dirname, "../../", img.nombre_archivo);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
      await pool.query(`
        DELETE FROM imagenes_comentarios
        WHERE comment_id = ? AND nombre_archivo = ?
      `, [id, img.nombre_archivo]);
    }

    if (req.files && req.files.length > 0) {
      const imagenes = req.files.map((file) => file.filename);
      for (const nombreArchivo of imagenes) {
        await pool.query(`
          INSERT INTO imagenes_comentarios (comment_id, nombre_archivo)
          VALUES (?, ?)
        `, [id, `comments/${nombreArchivo}`]);
      }
    }

    res.status(200).json({ message: "Comentario actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar comentario:", error);
    res.status(500).json({ error: "Error al actualizar comentario" });
  }
};


exports.eliminarComentario = async (req, res) => {
  const { id } = req.params;

  try {

    

    const [imagenes] = await pool.query(`SELECT nombre_archivo FROM imagenes_comentarios WHERE comment_id = ?`, [id]);

    for (const img of imagenes) {
      const rutaImagen = path.join(__dirname, "../../", img.nombre_archivo);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen); // elimina del disco
      }
      const[result] = await pool.query(`DELETE FROM imagenes_comentarios WHERE comment_id = ? AND nombre_archivo = ?`, [id, img.nombre_archivo]);
    }

    await pool.query(`DELETE FROM comentarios_productos WHERE id = ?`, [id]);
    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
};

/*
exports.crearComentario = async (req, res) => {
  const { id_producto, id_usuario, comentario, calificacion } = req.body;

  try {
    const [result] = await pool.query(`
      INSERT INTO comentarios_productos (id_producto, id_usuario, comentario, calificacion)
      VALUES (?, ?, ?, ?)
    `, [id_producto, id_usuario, comentario, calificacion]);

    res.status(201).json({ message: "Comentario creado correctamente", id: result.insertId });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error al crear comentario" });
  }
};

exports.obtenerComentariosPorProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const [comentarios] = await pool.query(`
      SELECT c.*, u.nombre AS nombre_usuario
      FROM comentarios_productos c
      JOIN usuarios u ON c.id_usuario = u.iduser
      WHERE c.id_producto = ?
      ORDER BY c.fecha_comentario DESC
    `, [id_producto]);

    res.status(200).json(comentarios);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

exports.editarComentario = async (req, res) => {
  const { id } = req.params;
  const { comentario, calificacion } = req.body;

  try {
    await pool.query(`
      UPDATE comentarios_productos 
      SET comentario = ?, calificacion = ?
      WHERE id = ?
    `, [comentario, calificacion, id]);

    res.status(200).json({ message: "Comentario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    res.status(500).json({ error: "Error al actualizar comentario" });
  }
};

exports.eliminarComentario = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM comentarios_productos WHERE id = ?`, [id]);
    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
};

exports.obtenerComentario = async (req, res) => {
  const { id } = req.params;

  try {
    const [comentario] = await pool.query(
      `SELECT c.*, u.nombre AS nombre_usuario 
       FROM comentarios_productos c
       JOIN usuarios u ON c.id_usuario = u.iduser
       WHERE c.id = ?`,
      [id]
    );

    if (comentario.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.status(200).json(comentario[0]);
  } catch (error) {
    console.error("Error al obtener comentario:", error);
    res.status(500).json({ error: "Error al obtener comentario" });
  }
}; */