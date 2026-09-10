const Product = require('../models/Product');

// ===============================
// Crear producto
// ===============================
const crearProducto = async (req, res) => {

    try {

        const producto = new Product({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            categoria: req.body.categoria,
            stock: req.body.stock,
            imagen: req.body.imagen,
            usuario: req.usuario.id
        });

        await producto.save();

        res.status(201).json({
            mensaje: "Producto creado correctamente",
            producto
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Obtener todos los productos
// ===============================
const obtenerProductos = async (req, res) => {

    try {

        const productos = await Product.find()
            .sort({ fechaRegistro: -1 });

        res.json(productos);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Obtener producto por ID
// ===============================
const obtenerProductoPorId = async (req, res) => {

    try {

        const producto = await Product.findById(req.params.id);

        if (!producto) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        res.json(producto);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Editar producto
// ===============================
const editarProducto = async (req, res) => {

    try {

        const producto = await Product.findById(req.params.id);

        if (!producto) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        // Verificar propietario
        if (producto.usuario.toString() !== req.usuario.id) {

            return res.status(403).json({
                mensaje: "No tienes permiso para editar este producto"
            });

        }

        producto.nombre = req.body.nombre ?? producto.nombre;
        producto.descripcion = req.body.descripcion ?? producto.descripcion;
        producto.precio = req.body.precio ?? producto.precio;
        producto.categoria = req.body.categoria ?? producto.categoria;
        producto.stock = req.body.stock ?? producto.stock;
        producto.imagen = req.body.imagen ?? producto.imagen;

        await producto.save();

        res.json({
            mensaje: "Producto actualizado correctamente",
            producto
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Eliminar producto
// ===============================
const eliminarProducto = async (req, res) => {

    try {

        const producto = await Product.findById(req.params.id);

        if (!producto) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        // Verificar propietario
        if (producto.usuario.toString() !== req.usuario.id) {

            return res.status(403).json({
                mensaje: "No tienes permiso para eliminar este producto"
            });

        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Buscar productos por categoría
// ===============================
const buscarPorCategoria = async (req, res) => {

    try {

        const productos = await Product.find({
            categoria: req.params.categoria
        }).sort({ fechaRegistro: -1 });

        res.json(productos);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Búsqueda avanzada de productos
// ===============================
const busquedaAvanzada = async (req, res) => {

    try {

        const filtro = {};

        // Categoría
        if (req.query.categoria) {

            filtro.categoria = req.query.categoria;

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

        // Stock mínimo
        if (req.query.stockMin) {

            filtro.stock = {
                ...filtro.stock,
                $gte: Number(req.query.stockMin)
            };

        }

        // Solo productos disponibles
        if (req.query.disponible === 'true') {

            filtro.stock = {
                ...filtro.stock,
                $gt: 0
            };

        }

        const productos = await Product.find(filtro)
            .sort({ fechaRegistro: -1 });

        res.json(productos);

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
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    editarProducto,
    eliminarProducto,
    buscarPorCategoria,
    busquedaAvanzada
};