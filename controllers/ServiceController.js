const Service = require('../models/Service');

// ===============================
// Publicar servicio
// ===============================
const publicarServicio = async (req, res) => {

    try {

        console.log("========== DATOS RECIBIDOS ==========");
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        console.log("USUARIO:", req.usuario);
        console.log("=====================================");

        const imagenes = req.files
            ? req.files.map(file => file.filename)
            : [];

        const servicio = new Service({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
    municipio: req.body.municipio,
    barrio: req.body.barrio,
    direccion: req.body.direccion,

    // ===============================
    // GEOLOCALIZACIÓN
    // ===============================

    ubicacion: {
        latitud: req.body.latitud
            ? Number(req.body.latitud)
            : null,

        longitud: req.body.longitud
            ? Number(req.body.longitud)
            : null
    },

    precio: req.body.precio,
    duracion: req.body.duracion,
    estado: req.body.estado,
    imagenes,
    usuario: req.usuario.id
});

        await servicio.save();

        res.status(201).json({
            mensaje: "Servicio publicado correctamente",
            servicio
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Obtener todos los servicios
// ===============================
const obtenerServicios = async (req, res) => {

    try {

        const servicios = await Service.find()
            .populate('usuario', 'nombres apellidos correo');

        const resultado = servicios.map(servicio => {

            const obj = servicio.toObject();

            obj.imagenes = obj.imagenes.map(img =>
                `${req.protocol}://${req.get('host')}/uploads/${img}`
            );

            return obj;

        });

        res.json(resultado);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Buscar por categoría
// ===============================
const buscarPorCategoria = async (req, res) => {

    try {

        const servicios = await Service.find({
            categoria: req.params.categoria
        }).populate('usuario', 'nombres apellidos correo');

        res.json(servicios);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Buscar por barrio
// ===============================
const buscarPorBarrio = async (req, res) => {

    try {

        const servicios = await Service.find({
            barrio: req.params.barrio
        }).populate('usuario', 'nombres apellidos correo');

        res.json(servicios);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Buscar por municipio
// ===============================
const buscarPorMunicipio = async (req, res) => {

    try {

        const servicios = await Service.find({
            municipio: req.params.municipio
        }).populate('usuario', 'nombres apellidos correo');

        res.json(servicios);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Buscar por estado
// ===============================
const buscarPorEstado = async (req, res) => {

    try {

        const servicios = await Service.find({
            estado: req.params.estado
        }).populate('usuario', 'nombres apellidos correo');

        res.json(servicios);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Editar servicio
// ===============================
const editarServicio = async (req, res) => {

    try {

        const servicio = await Service.findById(req.params.id);

        if (!servicio) {

            return res.status(404).json({
                mensaje: "Servicio no encontrado"
            });

        }

        // Verificar propietario
        if (
            !servicio.usuario ||
            servicio.usuario.toString() !== req.usuario.id
        ) {

            return res.status(403).json({
                mensaje: "No tienes permiso para editar este servicio"
            });

        }

        // Actualizar datos
        Object.assign(servicio, req.body);

        // Evitar que puedan cambiar el propietario
        servicio.usuario = req.usuario.id;

        await servicio.save();

        res.json({
            mensaje: "Servicio actualizado correctamente",
            servicio
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Eliminar servicio
// ===============================
const eliminarServicio = async (req, res) => {

    try {

        const servicio = await Service.findById(req.params.id);

        if (!servicio) {

            return res.status(404).json({
                mensaje: "Servicio no encontrado"
            });

        }

        // Verificar propietario
        if (
            !servicio.usuario ||
            servicio.usuario.toString() !== req.usuario.id
        ) {

            return res.status(403).json({
                mensaje: "No tienes permiso para eliminar este servicio"
            });

        }

        await Service.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: "Servicio eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Obtener categorías
// ===============================
const obtenerCategorias = (req, res) => {

    res.json([
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
    ]);

};


// ===============================
// Obtener servicios con ubicación
// ===============================
const obtenerServiciosConUbicacion = async (req, res) => {

    try {

        const servicios = await Service.find({
            "ubicacion.latitud": {
                $ne: null
            },
            "ubicacion.longitud": {
                $ne: null
            }
        })
        .populate(
            "usuario",
            "nombres apellidos correo"
        )
        .sort({
            fechaPublicacion: -1
        });

        const serviciosConUbicacion = servicios.map(servicio => {

            const servicioObjeto =
                servicio.toObject();

            servicioObjeto.imagenes =
                (servicioObjeto.imagenes || []).map(imagen => {

                    if (
                        imagen.startsWith("http://") ||
                        imagen.startsWith("https://")
                    ) {
                        return imagen;
                    }

                    return `${req.protocol}://${req.get("host")}/uploads/${imagen}`;

                });

            return servicioObjeto;

        });

        res.status(200).json(
            serviciosConUbicacion
        );

    } catch (error) {

        console.error(
            "Error obteniendo servicios con ubicación:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error obteniendo servicios con ubicación",
            error: error.message
        });

    }

};

// ===============================
// Búsqueda avanzada
// ===============================
// ===============================
// Búsqueda avanzada
// ===============================
const busquedaAvanzada = async (req, res) => {

    try {

        const filtro = {};

        // Categoría
        if (req.query.categoria) {
            filtro.categoria = req.query.categoria;
        }

        // Municipio
        if (req.query.municipio) {
            filtro.municipio = req.query.municipio;
        }

        // Barrio
        if (req.query.barrio) {
            filtro.barrio = req.query.barrio;
        }

        // Estado
        if (req.query.estado) {
            filtro.estado = req.query.estado;
        }

        // Precio mínimo
        if (req.query.precioMin) {
            filtro.precio = {
                ...filtro.precio,
                $gte: Number(req.query.precioMin)
            };
        }

        // Precio máximo
        if (req.query.precioMax) {
            filtro.precio = {
                ...filtro.precio,
                $lte: Number(req.query.precioMax)
            };
        }

        const servicios = await Service.find(filtro)
            .populate('usuario', 'nombres apellidos correo')
            .sort({ fechaPublicacion: -1 });

        res.json(servicios);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// ===============================
// Exportar funciones
// ===============================
module.exports = {

    publicarServicio,
    obtenerServicios,
    buscarPorCategoria,
    buscarPorBarrio,
    buscarPorMunicipio,
    buscarPorEstado,
    busquedaAvanzada,
    editarServicio,
    eliminarServicio,
    obtenerCategorias,
    obtenerServiciosConUbicacion

};