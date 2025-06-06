const pool = require('../dbConfig/db');



exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categoria');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las categorias' });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const [category] = await pool.query('SELECT * FROM categoria WHERE id = ?', [id]);
        if (category.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(category[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
};


exports.createCategory = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
        }
        const [result] = await pool.query('INSERT INTO categoria (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ message: 'Categoría creada correctamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const [result] = await pool.query('UPDATE categoria SET nombre = ? WHERE id = ?', [nombre, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM categoria WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
};