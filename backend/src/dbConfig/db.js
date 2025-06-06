const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Verificar variables de entorno
console.log("📌 Configuración de la base de datos:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Crear el pool de conexiones
const pool = mysql.createPool({
    connectionLimit: 10, // Límite de conexiones activas
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Función para probar la conexión
async function connect() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado a la base de datos correctamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1); // Forzar salida si hay error
    }
}

// Ejecutar la conexión
(async () => {
    await connect();
})();

module.exports = pool;
