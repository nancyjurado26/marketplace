const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },

    categoria: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    imagen: {
        type: String
    },

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Product', productSchema);