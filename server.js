const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const conectarDB = require('./config/db');

dotenv.config();

conectarDB();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.use((req, res, next) => {

    console.log("\n========== NUEVA PETICION ==========");
    console.log(`${req.method} ${req.url}`);

    next();
});

const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const compraRoutes = require("./routes/compras");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/usuarios', userRoutes);
app.use('/servicios', serviceRoutes);
app.use('/productos', productRoutes);
app.use("/compras", compraRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{

    console.log(`Servidor en ${PORT}`);

});