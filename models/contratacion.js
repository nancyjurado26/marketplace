const mongoose = require('mongoose');

const contratacionSchema = new mongoose.Schema({

    // Servicio que el usuario quiere contratar
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },

    // Usuario que ofrece el servicio
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Usuario que solicita/contrata el servicio
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Precio acordado
    precio: {
        type: Number,
        required: true
    },

    // Estado de la contratación
    estado: {
        type: String,
        enum: [
            'Pendiente',
            'Aceptada',
            'Rechazada',
            'En proceso',
            'Finalizada',
            'Cancelada'
        ],
        default: 'Pendiente'
    },

    // Mensaje inicial del cliente
    mensaje: {
        type: String,
        default: ''
    },

    fechaSolicitud: {
        type: Date,
        default: Date.now
    },

    fechaActualizacion: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Contratacion', contratacionSchema);