const express = require("express");
const router = express.Router();

const Comentario = require("../models/comentario");
const verificarToken = require("../middleware/auth");

// =====================================================
// CREAR COMENTARIO / CALIFICACIÓN
// =====================================================

router.post(
    "/",
    verificarToken,
    async (req, res) => {

        try {

            const {
                tipo,
                servicio,
                usuarioValorado,
                calificacion,
                comentario
            } = req.body;

            // =========================================
            // VALIDAR DATOS
            // =========================================

            if (
                !tipo ||
                !calificacion ||
                !comentario
            ) {

                return res.status(400).json({
                    mensaje:
                        "Todos los campos obligatorios deben estar completos."
                });
            }

            // =========================================
            // VALIDAR CALIFICACIÓN
            // =========================================

            if (
                calificacion < 1 ||
                calificacion > 5
            ) {

                return res.status(400).json({
                    mensaje:
                        "La calificación debe estar entre 1 y 5 estrellas."
                });
            }

            // =========================================
            // CREAR COMENTARIO
            // =========================================

            const nuevoComentario =
                new Comentario({

                    usuario: req.usuario.id,

                    tipo,

                    servicio:
                        servicio || null,

                    usuarioValorado:
                        usuarioValorado || null,

                    calificacion,

                    comentario

                });

            await nuevoComentario.save();

            res.status(201).json({

                mensaje:
                    "✅ Comentario guardado correctamente.",

                comentario:
                    nuevoComentario

            });

        } catch (error) {

            console.error(
                "❌ Error creando comentario:",
                error
            );

            res.status(500).json({

                mensaje:
                    "Error al guardar el comentario."

            });
        }

    }
);


// =====================================================
// OBTENER COMENTARIOS
// =====================================================

router.get(
    "/",
    async (req, res) => {

        try {

            const comentarios =
                await Comentario.find()
                    .populate(
                        "usuario",
                        "nombres apellidos"
                    )
                    .populate(
                        "servicio",
                        "titulo"
                    )
                    .populate(
                        "usuarioValorado",
                        "nombres apellidos"
                    )
                    .sort({
                        fecha: -1
                    });

            res.json(
                comentarios
            );

        } catch (error) {

            console.error(
                "❌ Error obteniendo comentarios:",
                error
            );

            res.status(500).json({

                mensaje:
                    "Error obteniendo comentarios."

            });
        }

    }
);


module.exports = router;