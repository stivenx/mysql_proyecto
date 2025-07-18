const pool = require('../dbConfig/db');



exports.getAllTypes = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM tipo');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las categorias' });
    }
};

exports.getTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const [type] = await pool.query('SELECT * FROM tipo WHERE id = ?', [id]);
        if (type.length === 0) {
            return res.status(404).json({ error: 'tipo no encontrada' });
        }
        res.status(200).json(type[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
};


exports.createType = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre del tipo es obligatorio' });
        }
        const [result] = await pool.query('INSERT INTO tipo (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ message: 'tipo creada correctamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
};

exports.updateType = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const [result] = await pool.query('UPDATE tipo SET nombre = ? WHERE id = ?', [nombre, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'tipo no encontrada' });
        }
        res.status(200).json({ message: 'tipo actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el tipo' });
    }
};

exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM tipo WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'tipo no encontrada' });
        }
        res.status(200).json({ message: 'tipo eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el tipo' });
    }
};