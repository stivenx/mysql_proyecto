const express = require('express');
const cors = require('cors');
const routesUser = require('./routes/routesUser');
const routesProducts = require('./routes/routesProducts');
const routesCategori = require('./routes/routesCategori');
const routesCarrito = require('./routes/routesCarrito');
const routesDocument = require('./routes/routesDocument');
const routesTipo = require('./routes/routesTipo');
const routesComment = require('./routes/routesComment');

const dotenv = require('dotenv');
const pool = require('./dbConfig/db');

dotenv.config();

const app = express();
const port = 5000;


const path = require ("path");






// Esto es lo IMPORTANTE
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/products", express.static(path.join(__dirname, "../products")));
app.use("/comments", express.static(path.join(__dirname, "../comments")));


app.use(cors());
app.use(express.json());

app.use('/api/users', routesUser);
app.use('/api/products', routesProducts);
app.use('/api/categoria', routesCategori);
app.use('/api/carrito', routesCarrito);
app.use('/api/documentos', routesDocument);
app.use('/api/tipo', routesTipo);
app.use('/api/comentarios', routesComment);

// Verificar conexión a la base de datos
async function testDBConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado a la base de datos correctamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
    }
}

testDBConnection();

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});