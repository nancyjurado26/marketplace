const express = require("express");

const router = express.Router();

const {

    crearCompra,

    obtenerCompras,

    actualizarEstadoCompra

} = require("../controllers/CompraController");

const verificarToken = require("../middleware/auth");


console.log("✅ RUTA DE COMPRAS CARGADA");

console.log(
    "crearCompra:",
    typeof crearCompra
);

console.log(
    "obtenerCompras:",
    typeof obtenerCompras
);

console.log(
    "actualizarEstadoCompra:",
    typeof actualizarEstadoCompra
);


// ===============================
// CREAR COMPRA
// ===============================

router.post(
    "/",
    verificarToken,
    crearCompra
);


// ===============================
// OBTENER COMPRAS
// ===============================

router.get(
    "/",
    verificarToken,
    obtenerCompras
);


// ===============================
// ACTUALIZAR ESTADO
// ===============================

router.put(
    "/:id/estado",
    verificarToken,
    actualizarEstadoCompra
);


module.exports = router;