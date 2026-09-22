const mongoose = require('mongoose');

const solicitudServicioSchema = new mongoose.Schema({

    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },

    solicitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    estado: {
        type: String,
        enum: [
            "Pendiente",
            "Aceptada",
            "Rechazada",
            "Finalizada"
        ],
        default: "Pendiente"
    },

    fechaSolicitud: {
        type: Date,
        default: Date.now
    }

});

module.exports =
    mongoose.model(
        'SolicitudServicio',
        solicitudServicioSchema
    );