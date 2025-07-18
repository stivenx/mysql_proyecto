const pool = require('../dbConfig/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.register = async (req, res) => {
    try {
        const {nombre,correo,contrasena} = req.body;

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Verificar si el correo ya existe
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
            
        }

        // Guardar el usuario en la base de datos
        const [result] = await pool.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)', [nombre, correo, hashedPassword]);
        
        const [user] = await pool.query('SELECT * FROM usuarios WHERE iduser = ?', [result.insertId]);
       

        // Generar un token JWT
        const token = jwt.sign({ iduser: user[0].iduser,rol:user[0].rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        

        res.status(201).json({message: 'Usuario creado correctamente', id: result.insertId,nombre:req.body.nombre ,correo:req.body.correo,token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};


exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Buscar el usuario en la base de datos
        const [user] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (user.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Verificar la contraseña
        const passwordMatch = await bcrypt.compare(contrasena, user[0].contrasena);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ iduser: user[0].iduser,rol:user[0].rol }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.status(200).json({message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const { search } = req.params;
        const [users] = await pool.query('SELECT * FROM usuarios WHERE nombre LIKE ?', [`%${search}%`]);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { iduser } = req.params;
        const [user] = await pool.query('SELECT * FROM usuarios WHERE iduser = ?', [iduser]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};



exports.updateUser = async (req, res) => {
  try {
    const { iduser } = req.params;
    const { nombre, correo, contrasena, rol } = req.body;

    const camposActualizados = [];
    const valores = [];

    if (nombre) {
      camposActualizados.push('nombre = ?');
      valores.push(nombre);
    }

    if (correo) {
      camposActualizados.push('correo = ?');
      valores.push(correo);
    }

    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      camposActualizados.push('contrasena = ?');
      valores.push(hashedPassword);
    }

    if (rol) {
      camposActualizados.push('rol = ?');
      valores.push(rol);
    }

    // Si no hay campos para actualizar
    if (camposActualizados.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
    }

    // Agrega el ID al final de los valores
    valores.push(iduser);

    const [result] = await pool.query(
      `UPDATE usuarios SET ${camposActualizados.join(', ')} WHERE iduser = ?`,
      valores
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};


exports.deleteUser = async (req, res) => {
    try {
        const { iduser } = req.params;
        const [result] = await pool.query('DELETE FROM usuarios WHERE iduser = ?', [iduser]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};