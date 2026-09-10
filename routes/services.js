const express = require('express');

const router = express.Router();

const upload = require('../config/multer');

const verificarToken = require('../middleware/auth');

const {
    publicarServicio,
    obtenerServicios,
    buscarPorCategoria,
    buscarPorBarrio,
    buscarPorMunicipio,
    buscarPorEstado,
    busquedaAvanzada,
    editarServicio,
    eliminarServicio,
    obtenerCategorias,
    obtenerServiciosConUbicacion
} = require('../controllers/ServiceController');


// ========================================
// RUTAS PÚBLICAS
// ========================================

// Buscar por barrio
router.get('/barrio/:barrio', buscarPorBarrio);

// Buscar por municipio
router.get('/municipio/:municipio', buscarPorMunicipio);

// Buscar por estado
router.get('/estado/:estado', buscarPorEstado);

// Búsqueda avanzada
router.get('/busqueda', busquedaAvanzada);

// Obtener todos los servicios
router.get('/', obtenerServicios);

// Obtener categorías
router.get('/categorias', obtenerCategorias);

// Obtener servicios con ubicación
router.get('/ubicacion', obtenerServiciosConUbicacion);

// Buscar por categoría
router.get('/categoria/:categoria', buscarPorCategoria);


// ========================================
// RUTAS PROTEGIDAS
// ========================================

// Publicar servicio
router.post(
    '/publicar',
    verificarToken,
    upload.array('imagenes', 5),
    publicarServicio
);


// Editar servicio
router.put(
    '/editar/:id',
    verificarToken,
    editarServicio
);


// Eliminar servicio
router.delete(
    '/eliminar/:id',
    verificarToken,
    eliminarServicio
);

module.exports = router;