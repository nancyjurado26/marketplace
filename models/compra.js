const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({

    // ===============================
    // USUARIO QUE REALIZÓ LA COMPRA.
    // ===============================
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // ===============================
    // PRODUCTOS
    // ===============================
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            nombre: {
                type: String,
                required: true
            },

            imagen: {
                type: String,
                default: ""
            },

            precio: {
                type: Number,
                required: true
            },

            cantidad: {
                type: Number,
                required: true,
                min: 1
            },

            subtotal: {
                type: Number,
                required: true
            }
        }
    ],

    // ===============================
    // TOTAL
    // ===============================
    total: {
        type: Number,
        required: true
    },

    // ===============================
    // FECHA
    // ===============================
    fecha: {
        type: Date,
        default: Date.now
    },

    // ===============================
    // ESTADO
    // ===============================
    estado: {
        type: String,
        default: "Pendiente"
    }

});

module.exports = mongoose.model("Compra", compraSchema);