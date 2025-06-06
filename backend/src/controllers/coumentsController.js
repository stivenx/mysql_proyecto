const pool = require('../dbConfig/db');
const multer = require ("multer");
const path = require ("path");
const fs = require("fs");
// Almacenamiento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

exports.upload = multer({ storage });


exports.crearDocumento = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    const [result] = await pool.query(
      "INSERT INTO documentos (titulo, descripcion) VALUES (?, ?)",
      [titulo, descripcion]
    );

    const documentoId = result.insertId;

    const imagenes = req.files.map((file) => file.filename);

    for (const nombreArchivo of imagenes) {
      await pool.query(
        "INSERT INTO imagenes_documentos (documento_id, nombre_archivo) VALUES (?, ?)",
        [documentoId, `uploads/${nombreArchivo}`]
      );
    }

    res.status(201).json({ message: "Documento creado con imágenes." });
  } catch (error) {
    console.error("Error al crear documento:", error);
    res.status(500).json({ message: "Error al crear el documento" });
  }
};

// Función para obtener todos los documentos junto con sus imágenes relacionadas
exports.obtenerDocumentos = async (req, res) => {
  try {
    // Consulta SQL: obtiene datos de documentos y las imágenes asociadas (si existen)
    const [rows] = await pool.query(`
      SELECT d.id, d.titulo, d.descripcion, i.nombre_archivo
      FROM documentos d 
      LEFT JOIN imagenes_documentos i ON d.id = i.documento_id
    `);
    // Utiliza LEFT JOIN para asegurar que se incluyan todos los documentos, incluso si no tienen imágenes

    // Objeto temporal para agrupar documentos con sus imágenes
    const documentosMap = {};

    // Recorremos todas las filas obtenidas de la base de datos
    for (const row of rows) {
      // Si aún no se ha agregado este documento al mapa, lo inicializamos
      if (!documentosMap[row.id]) {
        documentosMap[row.id] = {
          id: row.id,
          titulo: row.titulo,
          descripcion: row.descripcion,
          imagenes: [], // Aquí se irán acumulando las imágenes del documento
        };
      }

      // Si hay un nombre de imagen, la agregamos al array de imágenes del documento
      if (row.nombre_archivo) {
        documentosMap[row.id].imagenes.push(row.nombre_archivo);
      }
    }

    // Convertimos el objeto en un array para enviarlo como respuesta
    const documentos = Object.values(documentosMap);

    // Enviamos los documentos (con sus imágenes agrupadas) como JSON al frontend
    res.json(documentos);
  } catch (error) {
    // Si ocurre un error en la consulta o procesamiento, lo mostramos en consola
    console.error("Error al obtener documentos:", error);

    // Y enviamos un mensaje de error al frontend
    res.status(500).json({ message: "Error al obtener los documentos" });
  }
};



exports.actualizarDocumento = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagenesConservadas } = req.body; // imagenesConservadas es un array de nombres

  try {
    // 1. Actualizar título y descripción
    await pool.query(
      "UPDATE documentos SET titulo = ?, descripcion = ? WHERE id = ?",
      [titulo, descripcion, id]
    );

    // 2. Obtener imágenes actuales del documento
    const [imagenesActuales] = await pool.query(
      "SELECT nombre_archivo FROM imagenes_documentos WHERE documento_id = ?",
      [id]
    );

    const imagenesAConservar = new Set(imagenesConservadas || []);
    const imagenesAEliminar = imagenesActuales.filter(
      (img) => !imagenesAConservar.has(img.nombre_archivo)
    );

    // 3. Eliminar imágenes que ya no se conservarán (DB y disco)
    for (const img of imagenesAEliminar) {
      const rutaImagen = path.join(__dirname, "../../", img.nombre_archivo);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen); // elimina del disco
      }
      await pool.query(
        "DELETE FROM imagenes_documentos WHERE documento_id = ? AND nombre_archivo = ?",
        [id, img.nombre_archivo]
      );
    }

    // 4. Agregar nuevas imágenes si hay
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          "INSERT INTO imagenes_documentos (documento_id, nombre_archivo) VALUES (?, ?)",
          [id, `uploads/${file.filename}`]
        );
      }
    }

    res.status(200).json({ message: "Documento actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar documento:", error);
    res.status(500).json({ message: "Error al actualizar el documento" });
  }
};
/*
exports.actualizarDocumento = async (req, res) => {
  const { id } = req.params;
  let { titulo, descripcion, imagenesConservadas } = req.body;

  try {
    // Verificar si imagenesConservadas llega como string (lo común con FormData)
    if (typeof imagenesConservadas === "string") {
      try {
        // Puede ser un JSON string o una única imagen
        imagenesConservadas = JSON.parse(imagenesConservadas);
      } catch {
        // Si no es un JSON válido, lo tratamos como un único valor
        imagenesConservadas = [imagenesConservadas];
      }
    }

    // Si viene como undefined, lo convertimos a array vacío
    if (!Array.isArray(imagenesConservadas)) {
      imagenesConservadas = [];
    }

    // 1. Actualizar título y descripción
    await pool.query(
      "UPDATE documentos SET titulo = ?, descripcion = ? WHERE id = ?",
      [titulo, descripcion, id]
    );

    // 2. Obtener imágenes actuales del documento
    const [imagenesActuales] = await pool.query(
      "SELECT nombre_archivo FROM imagenes_documentos WHERE documento_id = ?",
      [id]
    );

    const imagenesAConservar = new Set(imagenesConservadas);
    const imagenesAEliminar = imagenesActuales.filter(
      (img) => !imagenesAConservar.has(img.nombre_archivo)
    );

    // 3. Eliminar imágenes que ya no se conservarán (DB y disco)
    for (const img of imagenesAEliminar) {
      const rutaImagen = path.join(__dirname, "../../", img.nombre_archivo);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
      await pool.query(
        "DELETE FROM imagenes_documentos WHERE documento_id = ? AND nombre_archivo = ?",
        [id, img.nombre_archivo]
      );
    }

    // 4. Agregar nuevas imágenes si hay
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          "INSERT INTO imagenes_documentos (documento_id, nombre_archivo) VALUES (?, ?)",
          [id, `uploads/${file.filename}`]
        );
      }
    }

    res.status(200).json({ message: "Documento actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar documento:", error);
    res.status(500).json({ message: "Error al actualizar el documento" });
  }
};
*/

exports.obtenerDocumentoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT d.id, d.titulo, d.descripcion, i.nombre_archivo
      FROM documentos d
      LEFT JOIN imagenes_documentos i ON d.id = i.documento_id
      WHERE d.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Agrupar imágenes del documento
    const documento = {
      id: rows[0].id,
      titulo: rows[0].titulo,
      descripcion: rows[0].descripcion,
      imagenes: [],
    };

    for (const row of rows) {
      if (row.nombre_archivo) {
        documento.imagenes.push(row.nombre_archivo);
      }
    }

    res.json(documento);
  } catch (error) {
    console.error("Error al obtener documento:", error);
    res.status(500).json({ message: "Error al obtener el documento" });
  }
};



exports.eliminardocumentos = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obtener imágenes relacionadas
    const [imagenes] = await pool.query(
      "SELECT nombre_archivo FROM imagenes_documentos WHERE documento_id = ?",
      [id]
    );

    // 2. Eliminar archivos del sistema
    for (const img of imagenes) {
      const rutaImagen = path.join(__dirname, "../../", img.nombre_archivo);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen); // Elimina el archivo físico
      }
    }

    // 3. Eliminar registros de imagenes_documentos
    await pool.query(
      "DELETE FROM imagenes_documentos WHERE documento_id = ?",
      [id]
    );

    // 4. Eliminar el documento
    await pool.query("DELETE FROM documentos WHERE id = ?", [id]);

    res.status(200).json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    res.status(500).json({ message: "Error al eliminar el documento" });
  }
};
