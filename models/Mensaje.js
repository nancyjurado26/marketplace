
const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
    contratacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contratacion',
        required: true,
        index: true
    },

    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    texto: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },

    fecha: {
        type: Date,
        default: Date.now
    }
});

mensajeSchema.index({ contratacion: 1, fecha: 1 });

module.exports = mongoose.model('Mensaje', mensajeSchema);
