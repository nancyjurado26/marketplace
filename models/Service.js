const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    titulo: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        required: true
    },

   categoria: {
    type: String,
    enum: [
        "Salud",
        "Hogar",
        "Educación",
        "Tecnología",
        "Mascotas",
        "Transporte",
        "Belleza",
        "Construcción",
        "Emergencias",
        "Otros"
    ],
    required: true
},
    

    municipio: {
        type: String,
        required: true
    },

    barrio: {
        type: String,
        required: true
    },

    direccion: {
        type: String
    },

    ubicacion: {
        latitud: {
            type: Number
        },
        longitud: {
            type: Number
        }
    },

    precio: {
        type: Number,
        required: true
    },

    duracion: {
        type: String
    },

    estado: {
        type: String,
        enum: ["Disponible", "En proceso", "Finalizado"],
        default: "Disponible"
    },

    imagenes: [{
        type: String
    }],

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    fechaPublicacion: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Service', serviceSchema);