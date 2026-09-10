const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        const nombre = Date.now() + path.extname(file.originalname);
        cb(null, nombre);
    }
});

// Solo permitir imágenes
const fileFilter = (req, file, cb) => {

    const tipos = /jpg|jpeg|png|gif|webp/;

    const extension = tipos.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mime = tipos.test(file.mimetype);

    if (extension && mime) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes"));
    }
};

module.exports = multer({
    storage,
    fileFilter
});