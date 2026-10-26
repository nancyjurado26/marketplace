
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


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

/* =====================================
   SOLICITAR RECUPERACIÓN DE CONTRASEÑA
   ===================================== */

const solicitarRecuperacionPassword = async (req, res) => {
    try {
        const correo = String(req.body.correo || "")
            .trim()
            .toLowerCase();

        if (!correo) {
            return res.status(400).json({
                mensaje: "Debes ingresar tu correo electrónico."
            });
        }

        const respuestaGenerica =
            "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.";

        const usuario = await User.findOne({ correo });

        // No revelar si una cuenta existe o no.
        if (!usuario) {
            return res.json({ mensaje: respuestaGenerica });
        }

        // Crear un token aleatorio y guardar solamente su hash.
        const token = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        usuario.resetPasswordToken = tokenHash;
        usuario.resetPasswordExpires =
            new Date(Date.now() + 15 * 60 * 1000);

        await usuario.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const appUrl = (
            process.env.APP_URL || "http://localhost:4000"
        ).replace(/\/+$/, "");

        const enlace =
            `${appUrl}/?resetToken=${token}` +
            `&email=${encodeURIComponent(usuario.correo)}`;

        await transporter.sendMail({
            from: `"SOKO Marketplace" <${process.env.EMAIL_USER}>`,
            to: usuario.correo,
            subject: "Recuperación de contraseña - SOKO Marketplace",
            text:
                `Hola ${usuario.nombres || ""}.\n\n` +
                "Recibimos una solicitud para cambiar tu contraseña.\n\n" +
                `Abre este enlace para continuar: ${enlace}\n\n` +
                "El enlace vence en 15 minutos. " +
                "Si no solicitaste este cambio, ignora este correo."
        });

        return res.json({ mensaje: respuestaGenerica });

    } catch (error) {
        console.error("Error solicitando recuperación:", error);

        return res.status(500).json({
            mensaje: "No se pudo enviar el correo. Inténtalo más tarde."
        });
    }
};


/* =====================================
   RESTABLECER CONTRASEÑA
   ===================================== */

const restablecerPassword = async (req, res) => {
    try {
        const { token, correo, nuevaPassword } = req.body;

        if (!token || !correo || !nuevaPassword) {
            return res.status(400).json({
                mensaje: "Debes completar todos los campos."
            });
        }

        if (nuevaPassword.length < 8) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 8 caracteres."
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const usuario = await User.findOne({
            correo: String(correo).trim().toLowerCase(),
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!usuario) {
            return res.status(400).json({
                mensaje: "El enlace no es válido o ya venció. Solicita uno nuevo."
            });
        }

        usuario.password = await bcrypt.hash(nuevaPassword, 10);

        // El enlace queda invalidado después de utilizarse.
        usuario.resetPasswordToken = null;
        usuario.resetPasswordExpires = null;

        await usuario.save();

        return res.json({
            mensaje: "Contraseña actualizada correctamente. Ya puedes iniciar sesión."
        });

    } catch (error) {
        console.error("Error restableciendo contraseña:", error);

        return res.status(500).json({
            mensaje: "No se pudo cambiar la contraseña. Inténtalo nuevamente."
        });
    }
};


// ===============================
// EXPORTAR FUNCIONES
// ===============================



module.exports = {
    registrarUsuario,
    loginUsuario,
    cambiarPassword,
    solicitarRecuperacionPassword,
    restablecerPassword
};
