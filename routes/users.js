
const express = require("express");

const router = express.Router();

const {
    registrarUsuario,
    loginUsuario,
    cambiarPassword,
    solicitarRecuperacionPassword,
    restablecerPassword
} = require("../controllers/UserController");


const verificarToken = require("../middleware/auth");


// ===============================
// Ruta de prueba
// ===============================

router.get("/prueba", (req, res) => {
    res.send("Usuarios OK");
});


// ===============================
// Registrar usuario
// ===============================

router.post(
    "/registro",
    registrarUsuario
);


// ===============================
// Iniciar sesión
// ===============================

router.post(
    "/login",
    loginUsuario
);


// ===============================
// Cambiar contraseña
// ===============================

router.put(
    "/cambiar-password",
    verificarToken,
    cambiarPassword
);

router.post(
    "/solicitar-recuperacion",
    solicitarRecuperacionPassword
);

router.post(
    "/restablecer-password",
    restablecerPassword
);


module.exports = router;

