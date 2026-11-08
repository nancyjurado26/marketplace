const express = require("express");

const router = express.Router();
const Compra = require("../models/compra");
const Product = require("../models/Product");
const Mensaje = require("../models/Mensaje");

const {

    crearCompra,

    obtenerCompras,

    actualizarEstadoCompra

} = require("../controllers/compraController");

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


// ============================================
// CHAT PRIVADO DE COMPRAS Y PRODUCTOS
// ============================================


// ============================================
// OBTENER MENSAJES DE UNA COMPRA Y PRODUCTO
// ============================================

router.get("/:id/productos/:productoId/mensajes", verificarToken, async (req, res) => {

    try {

        const { id, productoId } = req.params;
        const usuarioId = req.usuario.id;

        // Buscar compra
        const compra = await Compra.findById(id);

        if (!compra) {
            return res.status(404).json({
                mensaje: "Compra no encontrada"
            });
        }

        // Comprobar que el producto pertenece a esa compra
        const productoEnCompra = compra.productos.some(item =>
            item.producto &&
            item.producto.toString() === productoId
        );

        if (!productoEnCompra) {
            return res.status(403).json({
                mensaje: "Este producto no pertenece a la compra"
            });
        }

        // Buscar producto y vendedor
        const producto = await Product.findById(productoId);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        // Identificar comprador y vendedor
        const esComprador =
            compra.usuario.toString() === usuarioId.toString();

        const esVendedor =
            producto.usuario.toString() === usuarioId.toString();

        // Verificar permisos
        if (!esComprador && !esVendedor) {
            return res.status(403).json({
                mensaje: "No tienes permiso para acceder a este chat"
            });
        }

        // Obtener mensajes de esta conversación
        const mensajes = await Mensaje.find({
            compra: compra._id,
            producto: producto._id
        })
        .populate("remitente", "nombres apellidos")
        .sort({ fecha: 1 });

        res.status(200).json(mensajes);

    } catch (error) {

        console.error("Error obteniendo mensajes de compra:", error);

        res.status(500).json({
            mensaje: "Error al obtener los mensajes",
            error: error.message
        });

    }

});


// ============================================
// ENVIAR MENSAJE EN UNA COMPRA
// ============================================

router.post("/:id/productos/:productoId/mensajes", verificarToken, async (req, res) => {

    try {

        const { id, productoId } = req.params;
        const { texto } = req.body;
        const usuarioId = req.usuario.id;

        // Validar mensaje
        if (
            typeof texto !== "string" ||
            !texto.trim() ||
            texto.trim().length > 2000
        ) {
            return res.status(400).json({
                mensaje: "El mensaje debe tener entre 1 y 2000 caracteres"
            });
        }

        // Buscar compra
        const compra = await Compra.findById(id);

        if (!compra) {
            return res.status(404).json({
                mensaje: "Compra no encontrada"
            });
        }

        // Comprobar que el producto pertenece a la compra
        const productoEnCompra = compra.productos.some(item =>
            item.producto &&
            item.producto.toString() === productoId
        );

        if (!productoEnCompra) {
            return res.status(403).json({
                mensaje: "Este producto no pertenece a la compra"
            });
        }

        // Buscar producto
        const producto = await Product.findById(productoId);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        // Identificar participantes
        const esComprador =
            compra.usuario.toString() === usuarioId.toString();

        const esVendedor =
            producto.usuario.toString() === usuarioId.toString();

        // Verificar permisos
        if (!esComprador && !esVendedor) {
            return res.status(403).json({
                mensaje: "No tienes permiso para enviar mensajes en este chat"
            });
        }

        // Crear mensaje
        const nuevoMensaje = new Mensaje({

            compra: compra._id,

            producto: producto._id,

            remitente: usuarioId,

            texto: texto.trim()

        });

        await nuevoMensaje.save();

        await nuevoMensaje.populate(
            "remitente",
            "nombres apellidos"
        );

        res.status(201).json({
            mensaje: "Mensaje enviado correctamente",
            nuevoMensaje
        });

    } catch (error) {

        console.error("Error enviando mensaje de compra:", error);

        res.status(500).json({
            mensaje: "Error al enviar el mensaje",
            error: error.message
        });

    }

});




module.exports = router;
