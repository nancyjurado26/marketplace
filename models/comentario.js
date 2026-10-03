const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema({

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    tipo: {
        type: String,
        enum: [
            "usuario",
            "servicio",
            "plataforma"
        ],
        required: true
    },

    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        default: null
    },

    usuarioValorado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    calificacion: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    comentario: {
        type: String,
        required: true,
        trim: true
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Comentario",
    comentarioSchema
);