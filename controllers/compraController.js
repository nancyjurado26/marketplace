const Compra = require("../models/compra");




// ===============================
// CREAR COMPRA
// ===============================

const crearCompra = async (req, res) => {

    console.log("🔥🔥🔥 CONTROLADOR DE COMPRA EJECUTÁNDOSE 🔥🔥🔥");

    try {

        console.log("👤 USUARIO DEL TOKEN:");
        console.log(req.usuario);

        console.log("DATOS RECIBIDOS:");
        console.log(req.body);

        const { productos, medioPago } = req.body;


        // ===============================
        // VALIDAR CARRITO
        // ===============================

        if (!productos || productos.length === 0) {

            return res.status(400).json({
                mensaje: "El carrito está vacío"
            });

        }


        // ===============================
        // VALIDAR MEDIO DE PAGO
        // ===============================

        if (
            !medioPago ||
            !["tarjeta", "nequi", "breb"].includes(medioPago)
        ) {

            return res.status(400).json({
                mensaje: "Medio de pago no válido"
            });

        }


        // ===============================
        // CALCULAR TOTAL
        // ===============================

        let total = 0;

        const productosCompra = productos.map(producto => {

            const cantidad =
                Number(producto.cantidad) || 1;

            const precio =
                Number(producto.precio) || 0;

            const subtotal =
                precio * cantidad;

            total += subtotal;

            return {

                producto: producto._id,

                nombre: producto.nombre,

                imagen: producto.imagen || "",

                precio: precio,

                cantidad: cantidad,

                subtotal: subtotal

            };

        });


        console.log("PRODUCTOS A GUARDAR:");
        console.log(productosCompra);

        console.log("TOTAL:");
        console.log(total);

        console.log("MEDIO DE PAGO:");
        console.log(medioPago);


        // ===============================
        // CREAR COMPRA
        // ===============================

        const compra = new Compra({

            usuario: req.usuario.id,

            productos: productosCompra,

            total: total,

            medioPago: medioPago,

            estado: "Pendiente"

        });


        // ===============================
        // GUARDAR EN MONGODB
        // ===============================

        await compra.save();


        console.log("✅ COMPRA GUARDADA EN MONGODB");
        console.log(compra);


        return res.status(201).json({

            mensaje: "Compra registrada correctamente",

            compra: compra

        });


    } catch (error) {

        console.error("❌ ERROR REAL DE COMPRA:");
        console.error(error);

        return res.status(500).json({

            mensaje: "Error al registrar la compra",

            error: error.message

        });

    }

};


// ===============================
// OBTENER COMPRAS
// ===============================

const obtenerCompras = async (req, res) => {

    try {

        const compras = await Compra.find()
            .sort({ fecha: -1 });

        res.status(200).json(compras);

    } catch (error) {

        console.error(
            "Error obteniendo compras:",
            error
        );

        res.status(500).json({

            mensaje: "Error al obtener las compras",

            error: error.message

        });

    }

};
console.log("🔥 obtenerCompras existe:", typeof obtenerCompras);

// ===============================
// ACTUALIZAR ESTADO DE COMPRA
// ===============================

const actualizarEstadoCompra = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = [
            "Pendiente",
            "Confirmada",
            "Enviada",
            "Entregada",
            "Cancelada"
        ];

        if (!estadosPermitidos.includes(estado)) {

            return res.status(400).json({
                mensaje: "Estado de compra no válido"
            });

        }

        const compra = await Compra.findByIdAndUpdate(
            id,
            { estado: estado },
            { new: true }
        );

        if (!compra) {

            return res.status(404).json({
                mensaje: "Compra no encontrada"
            });

        }

        res.status(200).json({

            mensaje: "Estado de compra actualizado correctamente",

            compra: compra

        });

    } catch (error) {

        console.error(
            "Error actualizando estado:",
            error
        );

        res.status(500).json({

            mensaje: "Error al actualizar el estado",

            error: error.message

        });

    }

};


module.exports = {
    crearCompra,
    obtenerCompras,
    actualizarEstadoCompra
};
