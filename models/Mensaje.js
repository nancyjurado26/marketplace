
const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({

    // Conversación relacionada con un servicio
    contratacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contratacion',
        default: null,
        index: true
    },

    // Conversación relacionada con una compra
    compra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compra',
        default: null,
        index: true
    },


    // Producto específico de la conversación
producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
    index: true
},
    // Persona que envía el mensaje
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Contenido del mensaje
    texto: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },

    // Fecha del mensaje
    fecha: {
        type: Date,
        default: Date.now
    }

});

// Cada mensaje debe pertenecer a una sola operación
mensajeSchema.pre('validate', function () {

    const tieneContratacion = !!this.contratacion;
    const tieneCompra = !!this.compra;
    const tieneProducto = !!this.producto;

    // El mensaje debe pertenecer a una sola operación
    if (tieneContratacion === tieneCompra) {
        this.invalidate(
            'contratacion',
            'El mensaje debe pertenecer a una contratación o a una compra, pero no a ambas.'
        );
    }

    // Los mensajes de compras deben identificar el producto
    if (tieneCompra && !tieneProducto) {
        this.invalidate(
            'producto',
            'Los mensajes de compras deben identificar el producto.'
        );
    }

    // Los mensajes de servicios no deben tener producto
    if (tieneContratacion && tieneProducto) {
        this.invalidate(
            'producto',
            'Los mensajes de servicios no deben tener un producto.'
        );
    }
});

   


// Índices para consultar conversaciones
mensajeSchema.index({ contratacion: 1, fecha: 1 });
mensajeSchema.index({ compra: 1, fecha: 1 });
mensajeSchema.index({
    compra: 1,
    producto: 1,
    fecha: 1
});

module.exports = mongoose.model('Mensaje', mensajeSchema);
