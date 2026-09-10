
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ===============================
// Registrar usuario
// ===============================
const registrarUsuario = async (req, res) => {

    try {

        const {
            nombres,
            apellidos,
            correo,
            telefono,
            ciudad,
            direccion,
            password
        } = req.body;


        // ===============================
        // COMPROBAR CORREO
        // ===============================

        const existe = await User.findOne({ correo });

        if (existe) {

            return res.status(400).json({
                mensaje: "El correo ya está registrado"
            });

        }


        // ===============================
        // ENCRIPTAR CONTRASEÑA
        // ===============================

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(
            password,
            salt
        );


        // ===============================
        // CREAR USUARIO
        // ===============================

        const usuario = new User({

            nombres,
            apellidos,
            correo,
            telefono,
            ciudad,
            direccion,
            password: passwordHash

        });


        await usuario.save();


        // ===============================
        // RESPUESTA
        // ===============================

        res.status(201).json({

            mensaje: "Usuario registrado correctamente",

            usuario

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Login
// ===============================
const loginUsuario = async (req, res) => {

    try {

        const {
            correo,
            password
        } = req.body;


        // ===============================
        // BUSCAR USUARIO
        // ===============================

        const usuario = await User.findOne({
            correo
        });


        if (!usuario) {

            return res.status(400).json({
                mensaje: "Correo incorrecto"
            });

        }


        // ===============================
        // COMPROBAR CONTRASEÑA
        // ===============================

        const coincide = await bcrypt.compare(
            password,
            usuario.password
        );


        if (!coincide) {

            return res.status(400).json({
                mensaje: "Contraseña incorrecta"
            });

        }


        // ===============================
        // CREAR JWT
        // ===============================

        const token = jwt.sign(

            {
                id: usuario._id,
                correo: usuario.correo
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // ===============================
        // RESPUESTA
        // ===============================

        res.json({

            mensaje: "Bienvenido",

            token,

            usuario

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};


// ===============================
// Cambiar contraseña
// ===============================
const cambiarPassword = async (req, res) => {

    try {

        const {
            passwordActual,
            nuevaPassword
        } = req.body;


        // ===============================
        // VALIDAR DATOS
        // ===============================

        if (!passwordActual || !nuevaPassword) {

            return res.status(400).json({

                mensaje:
                    "Debes proporcionar la contraseña actual y la nueva contraseña"

            });

        }


        // ===============================
        // BUSCAR USUARIO DEL TOKEN
        // ===============================

        const usuario = await User.findById(
            req.usuario.id
        );


        if (!usuario) {

            return res.status(404).json({

                mensaje: "Usuario no encontrado"

            });

        }


        // ===============================
        // COMPROBAR CONTRASEÑA ACTUAL
        // ===============================

        const coincide = await bcrypt.compare(

            passwordActual,

            usuario.password

        );


        if (!coincide) {

            return res.status(400).json({

                mensaje:
                    "La contraseña actual es incorrecta"

            });

        }


        // ===============================
        // COMPROBAR QUE SEA DIFERENTE
        // ===============================

        const mismaPassword = await bcrypt.compare(

            nuevaPassword,

            usuario.password

        );


        if (mismaPassword) {

            return res.status(400).json({

                mensaje:
                    "La nueva contraseña debe ser diferente a la actual"

            });

        }


        // ===============================
        // ENCRIPTAR NUEVA CONTRASEÑA
        // ===============================

        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(

            nuevaPassword,

            salt

        );


        // ===============================
        // GUARDAR
        // ===============================

        usuario.password = passwordHash;

        await usuario.save();


        // ===============================
        // RESPUESTA
        // ===============================

        res.json({

            mensaje:
                "Contraseña cambiada correctamente"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: error.message

        });

    }

};


// ===============================
// EXPORTAR FUNCIONES
// ===============================

module.exports = {

    registrarUsuario,

    loginUsuario,

    cambiarPassword

};

