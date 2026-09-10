const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    nombres: {
        type: String,
        required: true
    },

    apellidos: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    telefono: {
        type: String,
        required: true
    },

    ciudad: {
        type: String,
        required: true
    },

    direccion: {
        type: String
    },

    password: {
        type: String,
        required: true
    },

    rol: {
        type: String,
        default: "usuario"
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", userSchema);