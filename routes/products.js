const express = require('express');

const router = express.Router();

const {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    editarProducto,
    eliminarProducto,
    buscarPorCategoria,
    busquedaAvanzada
} = require('../controllers/ProductController');

const verificarToken = require('../middleware/auth');

const upload = require('../config/multer');

// ===============================
// Crear producto - PROTEGIDO
// ===============================

router.post(
    '/',
    verificarToken,
    upload.single('imagen'),
    crearProducto
);


// ===============================
// Obtener todos los productos - PÚBLICO
// ===============================

router.get('/', obtenerProductos);


// ===============================
// Búsqueda avanzada - PÚBLICO
// ===============================

router.get('/busqueda', busquedaAvanzada);


// ===============================
// Buscar por categoría - PÚBLICO
// ===============================

router.get('/categoria/:categoria', buscarPorCategoria);


// ===============================
// Obtener producto por ID - PÚBLICO
// ===============================

router.get('/:id', obtenerProductoPorId);


// ===============================
// Editar producto - PROTEGIDO
// ===============================

router.put('/:id', verificarToken, editarProducto);


// ===============================
// Eliminar producto - PROTEGIDO
// ===============================

router.delete('/:id', verificarToken, eliminarProducto);


module.exports = router;