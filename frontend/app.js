
const API_URL = "http://localhost:4000";

let productosGlobales = [];
let carrito = [];


// =====================================================
// SERVICIOS
// =====================================================

let serviciosGlobales = [];


// =====================================================
// ABRIR MODAL PUBLICAR SERVICIO
// =====================================================

function abrirServicioModal() {

    const token = obtenerToken();

    if (!token) {

        alert("⚠️ Debes iniciar sesión para publicar un servicio.");

        abrirLogin();

        return;
    }

    const modal =
        document.getElementById("servicioModal");

    const mensaje =
        document.getElementById("mensajeServicio");

    if (mensaje) {
        mensaje.textContent = "";
    }

    if (modal) {
        modal.style.display = "flex";
    }
}


// =====================================================
// CERRAR MODAL SERVICIO
// =====================================================

function cerrarServicioModal() {

    const modal =
        document.getElementById("servicioModal");

    if (modal) {
        modal.style.display = "none";
    }

    const formulario =
        document.getElementById("formServicio");

    if (formulario) {
        formulario.reset();
    }

    const mensaje =
        document.getElementById("mensajeServicio");

    if (mensaje) {
        mensaje.textContent = "";
    }
}



// =====================================================
// PUBLICAR SERVICIO
// =====================================================

async function publicarServicio(event) {

    event.preventDefault();

    const mensaje =
        document.getElementById("mensajeServicio");


    try {

        // =========================================
        // OBTENER DATOS DEL FORMULARIO
        // =========================================

        const titulo =
            document
                .getElementById("servicioTitulo")
                .value
                .trim();

        const descripcion =
            document
                .getElementById("servicioDescripcion")
                .value
                .trim();

        const categoria =
            document
                .getElementById("servicioCategoria")
                .value;

        const municipio =
            document
                .getElementById("servicioMunicipio")
                .value
                .trim();

        const barrio =
            document
                .getElementById("servicioBarrio")
                .value
                .trim();

        const direccion =
            document
                .getElementById("servicioDireccion")
                .value
                .trim();

        const precio =
            document
                .getElementById("servicioPrecio")
                .value;

        const duracion =
            document
                .getElementById("servicioDuracion")
                .value
                .trim();

        const estado =
            document
                .getElementById("servicioEstado")
                .value;

        const imagenes =
            document
                .getElementById("servicioImagenes")
                .files;

        const latitud =
            document
                .getElementById("servicioLatitud")
                .value;

        const longitud =
            document
                .getElementById("servicioLongitud")
                .value;


        // =========================================
        // VALIDAR CAMPOS
        // =========================================

        if (
            !titulo ||
            !descripcion ||
            !categoria ||
            !municipio ||
            !barrio ||
            !direccion ||
            !precio ||
            !duracion ||
            !estado
        ) {

            mensaje.textContent =
                "⚠️ Completa todos los campos.";

            return;
        }


        // =========================================
        // VALIDAR IMÁGENES
        // =========================================

        if (imagenes.length > 5) {

            mensaje.textContent =
                "⚠️ Solo puedes seleccionar hasta 5 imágenes.";

            return;
        }


        // =========================================
        // OBTENER TOKEN
        // =========================================

        const token =
            obtenerToken();

        if (!token) {

            mensaje.textContent =
                "⚠️ Debes iniciar sesión para publicar un servicio.";

            abrirLogin();

            return;
        }


        // =========================================
        // CREAR FORMDATA
        // =========================================

        const datos =
            new FormData();

        datos.append(
            "titulo",
            titulo
        );

        datos.append(
            "descripcion",
            descripcion
        );

        datos.append(
            "categoria",
            categoria
        );

        datos.append(
            "municipio",
            municipio
        );

        datos.append(
            "barrio",
            barrio
        );

        datos.append(
            "direccion",
            direccion
        );

        datos.append(
            "precio",
            precio
        );

        datos.append(
            "duracion",
            duracion
        );

        datos.append(
            "estado",
            estado
        );

        datos.append(
            "latitud",
            latitud
        );

        datos.append(
            "longitud",
            longitud
        );


        // =========================================
        // AGREGAR IMÁGENES
        // =========================================

        for (
            let i = 0;
            i < imagenes.length;
            i++
        ) {

            datos.append(
                "imagenes",
                imagenes[i]
            );
        }


        // =========================================
        // ENVIAR AL BACKEND
        // =========================================

        console.log(
            "🛠️ Publicando servicio..."
        );

        const respuesta =
            await fetch(
                `${API_URL}/servicios/publicar`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: datos
                }
            );


        const resultado =
            await respuesta.json();


        console.log(
            "RESPUESTA SERVICIO:",
            resultado
        );


        // =========================================
        // SESIÓN EXPIRADA
        // =========================================

        if (respuesta.status === 401) {

            mensaje.textContent =
                "⚠️ Tu sesión ha expirado. Inicia sesión nuevamente.";

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "usuario"
            );

            actualizarBotonesUsuario();

            return;
        }


        // =========================================
        // ERROR DEL SERVIDOR
        // =========================================

        if (!respuesta.ok) {

            mensaje.textContent =
                "❌ " +
                (
                    resultado.mensaje ||
                    "No se pudo publicar el servicio."
                );

            return;
        }


        // =========================================
        // PUBLICACIÓN EXITOSA
        // =========================================

        mensaje.textContent =
            "✅ Servicio publicado correctamente.";


        const formulario =
            document.getElementById(
                "formServicio"
            );


        if (formulario) {

            formulario.reset();

        }


        // =========================================
        // ACTUALIZAR SERVICIOS
        // =========================================

        await obtenerServicios();


        // =========================================
        // CERRAR MODAL
        // =========================================

        setTimeout(
            () => {

                cerrarServicioModal();

                mensaje.textContent = "";

            },
            1000
        );


    } catch (error) {

        console.error(
            "Error publicando servicio:",
            error
        );

        mensaje.textContent =
            "❌ Error al conectar con el servidor.";
    }
}


// =====================================================
// OBTENER UBICACIÓN DEL SERVICIO
// =====================================================

window.obtenerUbicacionServicio = function () {

    const mensaje =
        document.getElementById(
            "mensajeUbicacion"
        );


    if (!navigator.geolocation) {

        mensaje.textContent =
            "❌ Tu navegador no permite obtener la ubicación.";

        return;
    }


    mensaje.textContent =
        "📍 Obteniendo tu ubicación...";


    navigator.geolocation.getCurrentPosition(

        function (posicion) {

            const latitud =
                posicion.coords.latitude;

            const longitud =
                posicion.coords.longitude;


            document.getElementById(
                "servicioLatitud"
            ).value = latitud;


            document.getElementById(
                "servicioLongitud"
            ).value = longitud;


            mensaje.textContent =
                "✅ Ubicación capturada correctamente.";


            console.log(
                "📍 Latitud:",
                latitud
            );

            console.log(
                "📍 Longitud:",
                longitud
            );
        },


        function (error) {

            console.error(
                "Error obteniendo ubicación:",
                error
            );


            mensaje.textContent =
                "❌ No se pudo obtener tu ubicación. " +
                "Verifica que hayas permitido el acceso a la ubicación.";
        },


        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
};




// =====================================================
// OBTENER SERVICIOS
// =====================================================

async function obtenerServicios() {

    const contenedor =
        document.getElementById(
            "listaServicios"
        );


    if (!contenedor) {
        return;
    }


    try {

        contenedor.innerHTML = `
            <p>
                ⏳ Cargando servicios...
            </p>
        `;


        const respuesta =
            await fetch(
                `${API_URL}/servicios`
            );


        const servicios =
            await respuesta.json();


        console.log(
            "SERVICIOS RECIBIDOS:",
            servicios
        );


        if (!respuesta.ok) {

            throw new Error(
                servicios.mensaje ||
                "No se pudieron obtener los servicios."
            );
        }


        serviciosGlobales =
            servicios;


        mostrarServicios(
            servicios
        );


    } catch (error) {

        console.error(
            "Error obteniendo servicios:",
            error
        );


        contenedor.innerHTML = `
            <p>
                ❌ No se pudieron cargar los servicios.
            </p>
        `;
    }
}


// =====================================================
// CALCULAR DISTANCIA ENTRE DOS UBICACIONES
// =====================================================

function calcularDistancia(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const radioTierra = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return radioTierra * c;
}




        window.buscarServiciosCercanos = function () {

    const mensaje =
        document.getElementById(
            "mensajeServiciosCercanos"
        );

    if (mensaje) {
        mensaje.textContent =
            "📍 Obteniendo tu ubicación...";
    }

    if (!navigator.geolocation) {

        if (mensaje) {
            mensaje.textContent =
                "❌ Tu navegador no permite obtener la ubicación.";
        }

        return;
    }

    navigator.geolocation.getCurrentPosition(

        async function (posicion) {

            const miLatitud =
                posicion.coords.latitude;

            const miLongitud =
                posicion.coords.longitude;

            console.log(
                "📍 MI LATITUD:",
                miLatitud
            );

            console.log(
                "📍 MI LONGITUD:",
                miLongitud
            );

            try {

                const respuesta =
                    await fetch(
                        `${API_URL}/servicios/ubicacion`
                    );

                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudieron obtener los servicios."
                    );

                }

                const servicios =
                    await respuesta.json();

                console.log(
                    "📍 SERVICIOS CON UBICACIÓN:",
                    servicios
                );

                if (!servicios.length) {

                    if (mensaje) {
                        mensaje.textContent =
                            "⚠️ No hay servicios con ubicación registrada.";
                    }

                    mostrarServicios([]);

                    return;
                }

                const serviciosConDistancia =
                    servicios.map(servicio => {

                        const latitudServicio =
                            Number(
                                servicio.ubicacion.latitud
                            );

                        const longitudServicio =
                            Number(
                                servicio.ubicacion.longitud
                            );

                        const distancia =
                            calcularDistancia(
                                miLatitud,
                                miLongitud,
                                latitudServicio,
                                longitudServicio
                            );

                        return {
                            ...servicio,
                            distancia
                        };

                    });

                serviciosConDistancia.sort(
                    (a, b) =>
                        a.distancia - b.distancia
                );

                const tresMasCercanos =
                    serviciosConDistancia.slice(
                        0,
                        3
                    );

                console.log(
                    "📍 3 SERVICIOS MÁS CERCANOS:",
                    tresMasCercanos
                );

                if (mensaje) {

                    mensaje.textContent =
                        `📍 Se encontraron ${tresMasCercanos.length} servicios cercanos.`;

                }

                mostrarServicios(
                    tresMasCercanos
                );

            } catch (error) {

                console.error(
                    "Error buscando servicios cercanos:",
                    error
                );

                if (mensaje) {

                    mensaje.textContent =
                        "❌ Error buscando servicios cercanos.";

                }

            }

        },

        function (error) {

            console.error(
                "Error de ubicación:",
                error
            );

            if (mensaje) {

                mensaje.textContent =
                    "⚠️ No fue posible obtener tu ubicación.";

            }

        }

    );

};



// =====================================================
// MOSTRAR SERVICIOS
// =====================================================

function mostrarServicios(servicios) {

    const contenedor =
        document.getElementById(
            "listaServicios"
        );

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (
        !servicios ||
        servicios.length === 0
    ) {

        contenedor.innerHTML = `
            <p>
                No hay servicios publicados todavía.
            </p>
        `;

        return;
    }

    servicios.forEach(servicio => {

        const tarjeta =
            document.createElement("div");

        tarjeta.classList.add(
            "servicio"
        );


        // =============================================
        // CALCULAR TEXTO DE DISTANCIA
        // =============================================

        let textoDistancia = "";

        if (
            servicio.distancia != null &&
            !isNaN(servicio.distancia)
        ) {

            if (servicio.distancia < 1) {

                const metros =
                    Math.round(
                        servicio.distancia * 1000
                    );

                textoDistancia = `
                    <p class="distancia-servicio">
                        <strong>
                            📍 Distancia:
                        </strong>
                        ${metros} metros
                    </p>
                `;

            } else {

                textoDistancia = `
                    <p class="distancia-servicio">
                        <strong>
                            📍 Distancia:
                        </strong>
                        ${servicio.distancia.toFixed(2)} km
                    </p>
                `;
            }
        }


        // =============================================
        // IMÁGENES
        // =============================================

        let imagenesHTML = "";

        if (
            servicio.imagenes &&
            servicio.imagenes.length > 0
        ) {

            imagenesHTML =
                servicio.imagenes.map(imagen => {

                    return `
                        <img
                            src="${imagen}"
                            alt="${servicio.titulo}"
                        >
                    `;

                }).join("");

        }


        // =============================================
        // TARJETA DEL SERVICIO
        // =============================================

        tarjeta.innerHTML = `

            <div class="servicio-imagenes">
                ${imagenesHTML}
            </div>

            <h3>
                ${servicio.titulo || "Sin título"}
            </h3>

            <p>
                <strong>
                    Descripción:
                </strong>

                ${servicio.descripcion || "Sin descripción"}
            </p>

            <p>
                <strong>
                    Categoría:
                </strong>

                ${servicio.categoria || "Sin categoría"}
            </p>

            <p>
                <strong>
                    💰 Precio:
                </strong>

                $${Number(
                    servicio.precio || 0
                ).toLocaleString("es-CO")}
            </p>

            <p>
                <strong>
                    📍 Municipio:
                </strong>

                ${servicio.municipio || "No especificado"}
            </p>

            <p>
                <strong>
                    🏘️ Barrio:
                </strong>

                ${servicio.barrio || "No especificado"}
            </p>

            <p>
                <strong>
                    🏠 Dirección:
                </strong>

                ${servicio.direccion || "No especificada"}
            </p>

            <p>
                <strong>
                    ⏱️ Duración:
                </strong>

                ${servicio.duracion || "No especificada"}
            </p>

            <p>
                <strong>
                    Estado:
                </strong>

                ${servicio.estado || "Disponible"}
            </p>

            ${textoDistancia}

        `;


        contenedor.appendChild(
            tarjeta
        );

    });
}


// =====================================================
// AUTENTICACIÓN JWT
// =====================================================

function obtenerToken() {
    return localStorage.getItem("token");
}

function guardarToken(token) {
    localStorage.setItem("token", token);
}

function obtenerUsuario() {

    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        return null;
    }

    try {
        return JSON.parse(usuario);
    } catch (error) {
        console.error("Error leyendo usuario:", error);
        return null;
    }
}


// =====================================================
// MI CUENTA
// =====================================================

function mostrarDatosCuenta() {

    const usuario = obtenerUsuario();

    if (!usuario) {
        return;
    }

    const campos = {
        cuentaNombres: usuario.nombres,
        cuentaApellidos: usuario.apellidos,
        cuentaCorreo: usuario.correo,
        cuentaTelefono: usuario.telefono,
        cuentaCiudad: usuario.ciudad,
        cuentaDireccion: usuario.direccion
    };

    Object.keys(campos).forEach(id => {

        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent =
                campos[id] || "No registrado";
        }
    });
}


function abrirMiCuenta() {

    const token = obtenerToken();
    const usuario = obtenerUsuario();

    if (!token || !usuario) {

        alert("Debes iniciar sesión primero.");

        abrirLogin();

        return;
    }

    // Mostrar datos del usuario
    mostrarDatosCuenta();

    // Ocultar cambio de contraseña al abrir
    const seccionPassword =
        document.getElementById("seccionCambioPassword");

    if (seccionPassword) {
        seccionPassword.style.display = "none";
    }

    const botonPassword =
        document.getElementById("btnMostrarCambioPassword");

    if (botonPassword) {
        botonPassword.textContent =
            "🔐 Cambiar contraseña";
    }

    const modal =
        document.getElementById("miCuenta");

    if (modal) {
        modal.style.display = "flex";
    }
}


// =====================================================
// MOSTRAR / OCULTAR CAMBIO DE CONTRASEÑA
// =====================================================

function mostrarCambioPassword() {

    const seccion =
        document.getElementById("seccionCambioPassword");

    const boton =
        document.getElementById("btnMostrarCambioPassword");

    if (!seccion) {
        return;
    }

    if (seccion.style.display === "none" ||
        seccion.style.display === "") {

        seccion.style.display = "block";

        if (boton) {
            boton.textContent =
                "🔐 Ocultar cambio de contraseña";
        }

    } else {

        seccion.style.display = "none";

        if (boton) {
            boton.textContent =
                "🔐 Cambiar contraseña";
        }
    }
}


// =====================================================
// CERRAR MI CUENTA
// =====================================================

function cerrarMiCuenta() {

    const modal =
        document.getElementById("miCuenta");

    if (modal) {
        modal.style.display = "none";
    }

    const formulario =
        document.getElementById("formCambiarPassword");

    if (formulario) {
        formulario.reset();
    }

    const mensaje =
        document.getElementById("mensajePassword");

    if (mensaje) {
        mensaje.textContent = "";
    }

    const seccion =
        document.getElementById("seccionCambioPassword");

    if (seccion) {
        seccion.style.display = "none";
    }

    const boton =
        document.getElementById("btnMostrarCambioPassword");

    if (boton) {
        boton.textContent =
            "🔐 Cambiar contraseña";
    }
}


// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================

async function cambiarPassword(event) {

    event.preventDefault();

    const passwordActual =
        document.getElementById("passwordActual").value;

    const nuevaPassword =
        document.getElementById("nuevaPassword").value;

    const confirmarPassword =
        document.getElementById("confirmarPassword").value;

    const mensaje =
        document.getElementById("mensajePassword");

    if (nuevaPassword !== confirmarPassword) {

        mensaje.textContent =
            "Las nuevas contraseñas no coinciden.";

        return;
    }

    if (nuevaPassword.length < 6) {

        mensaje.textContent =
            "La nueva contraseña debe tener al menos 6 caracteres.";

        return;
    }

    const token = obtenerToken();

    if (!token) {

        mensaje.textContent =
            "Tu sesión ha expirado. Inicia sesión nuevamente.";

        cerrarMiCuenta();
        abrirLogin();

        return;
    }

    try {

        mensaje.textContent =
            "Cambiando contraseña...";

        const respuesta = await fetch(
            `${API_URL}/usuarios/cambiar-password`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    passwordActual,
                    nuevaPassword
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            mensaje.textContent =
                datos.mensaje ||
                "No se pudo cambiar la contraseña.";

            return;
        }

        mensaje.textContent =
            "✅ Contraseña cambiada correctamente.";

        const formulario =
            document.getElementById("formCambiarPassword");

        if (formulario) {
            formulario.reset();
        }

    } catch (error) {

        console.error(
            "Error cambiando contraseña:",
            error
        );

        mensaje.textContent =
            "Error de conexión con el servidor.";
    }
}


// =====================================================
// REGISTRO DE USUARIO
// =====================================================

function abrirRegistro() {

    const modal =
        document.getElementById("registroModal");

    const mensaje =
        document.getElementById("mensajeRegistro");

    if (mensaje) {
        mensaje.textContent = "";
    }

    if (modal) {
        modal.style.display = "flex";
    }
}


function cerrarRegistro() {

    const modal =
        document.getElementById("registroModal");

    if (modal) {
        modal.style.display = "none";
    }

    const formulario =
        document.getElementById("formRegistro");

    if (formulario) {
        formulario.reset();
    }

    const mensaje =
        document.getElementById("mensajeRegistro");

    if (mensaje) {
        mensaje.textContent = "";
    }
}


async function registrarUsuario(event) {

    event.preventDefault();

    const nombres =
        document.getElementById("registroNombres").value.trim();

    const apellidos =
        document.getElementById("registroApellidos").value.trim();

    const correo =
        document.getElementById("registroCorreo").value.trim();

    const telefono =
        document.getElementById("registroTelefono").value.trim();

    const ciudad =
        document.getElementById("registroCiudad").value.trim();

    const direccion =
        document.getElementById("registroDireccion").value.trim();

    const password =
        document.getElementById("registroPassword").value;

    const confirmarPassword =
        document.getElementById("registroConfirmarPassword").value;

    const mensaje =
        document.getElementById("mensajeRegistro");


    // -----------------------------------------
    // VALIDACIONES
    // -----------------------------------------

    if (
        !nombres ||
        !apellidos ||
        !correo ||
        !telefono ||
        !ciudad ||
        !direccion ||
        !password ||
        !confirmarPassword
    ) {

        mensaje.textContent =
            "⚠️ Debes completar todos los campos.";

        return;
    }


    if (password !== confirmarPassword) {

        mensaje.textContent =
            "⚠️ Las contraseñas no coinciden.";

        return;
    }


    if (password.length < 6) {

        mensaje.textContent =
            "⚠️ La contraseña debe tener al menos 6 caracteres.";

        return;
    }


    try {

        mensaje.textContent =
            "⏳ Registrando usuario...";


        const respuesta = await fetch(
            `${API_URL}/usuarios/registrar`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nombres,
                    apellidos,
                    correo,
                    telefono,
                    ciudad,
                    direccion,
                    password
                })
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            mensaje.textContent =
                `❌ ${
                    datos.mensaje ||
                    "No se pudo registrar el usuario."
                }`;

            return;
        }


        mensaje.textContent =
            "✅ Usuario registrado correctamente.";


        const formulario =
            document.getElementById("formRegistro");

        if (formulario) {
            formulario.reset();
        }


        // Después de registrar,
        // abrir automáticamente el login

        setTimeout(() => {

            cerrarRegistro();

            abrirLogin();

            const loginCorreo =
                document.getElementById("loginCorreo");

            if (loginCorreo) {
                loginCorreo.value = correo;
            }

        }, 1000);


    } catch (error) {

        console.error(
            "Error registrando usuario:",
            error
        );

        mensaje.textContent =
            "❌ Error de conexión con el servidor.";
    }
}


// =====================================================
// ABRIR LOGIN
// =====================================================

function abrirLogin() {

    const modal =
        document.getElementById("loginModal");

    const correo =
        document.getElementById("loginCorreo");

    const password =
        document.getElementById("loginPassword");

    const mensaje =
        document.getElementById("mensajeLogin");


    if (correo) {
        correo.value = "";
    }

    if (password) {
        password.value = "";
    }

    if (mensaje) {
        mensaje.innerHTML = "";
    }

    if (modal) {
        modal.style.display = "flex";
    }
}


// =====================================================
// CERRAR LOGIN
// =====================================================

function cerrarLogin() {

    const modal =
        document.getElementById("loginModal");

    if (modal) {
        modal.style.display = "none";
    }
}


// =====================================================
// INICIAR SESIÓN
// =====================================================

async function iniciarSesion(event) {

    event.preventDefault();

    const correoElemento =
        document.getElementById("loginCorreo");

    const passwordElemento =
        document.getElementById("loginPassword");

    const mensaje =
        document.getElementById("mensajeLogin");


    if (
        !correoElemento ||
        !passwordElemento ||
        !mensaje
    ) {

        console.error(
            "Elementos del login no encontrados."
        );

        return;
    }


    const correo =
        correoElemento.value.trim();

    const password =
        passwordElemento.value;


    if (!correo || !password) {

        mensaje.innerHTML =
            "⚠️ Debes completar todos los campos.";

        return;
    }


    try {

        mensaje.innerHTML =
            "⏳ Iniciando sesión...";


        const respuesta = await fetch(
            `${API_URL}/usuarios/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    correo,
                    password
                })
            }
        );


        const datos =
            await respuesta.json();


        console.log(
            "RESPUESTA LOGIN:",
            datos
        );


        if (!respuesta.ok) {

            mensaje.innerHTML =
                `❌ ${
                    datos.mensaje ||
                    "Error al iniciar sesión."
                }`;

            return;
        }


        if (!datos.token) {

            mensaje.innerHTML =
                "❌ El servidor no devolvió un token.";

            return;
        }


        guardarToken(datos.token);


        if (datos.usuario) {

            localStorage.setItem(
                "usuario",
                JSON.stringify(datos.usuario)
            );
        }


        mensaje.innerHTML =
            "✅ Inicio de sesión correcto.";


        alert(
            `Bienvenido ${
                datos.usuario?.nombres || ""
            }`
        );


        cerrarLogin();

        actualizarBotonesUsuario();

    } catch (error) {

        console.error(
            "Error iniciando sesión:",
            error
        );

        mensaje.innerHTML =
            "❌ No se pudo conectar con el servidor.";
    }
}


// =====================================================
// CERRAR SESIÓN
// =====================================================

function cerrarSesion() {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    alert(
        "Sesión cerrada correctamente."
    );

    location.reload();
}


// =====================================================
// ACTUALIZAR BOTONES DE USUARIO
// =====================================================

function actualizarBotonesUsuario() {

    const btnLogin =
        document.getElementById("btnLogin");

    const btnRegistro =
        document.getElementById("btnRegistro");

    const btnMisCompras =
        document.getElementById("btnMisCompras");

    const btnMiCuenta =
        document.getElementById("btnMiCuenta");

    const btnCerrarSesion =
        document.getElementById("btnCerrarSesion");


    const usuario =
        obtenerUsuario();

    const token =
        obtenerToken();


    // -----------------------------------------
    // USUARIO LOGUEADO
    // -----------------------------------------

    if (token && usuario) {

        if (btnLogin) {
            btnLogin.style.display = "none";
        }

        if (btnRegistro) {
            btnRegistro.style.display = "none";
        }

        if (btnMisCompras) {
            btnMisCompras.style.display = "block";
        }

        if (btnMiCuenta) {
            btnMiCuenta.style.display = "block";
        }

        if (btnCerrarSesion) {
            btnCerrarSesion.style.display = "block";
        }

    }


    // -----------------------------------------
    // USUARIO NO LOGUEADO
    // -----------------------------------------

    else {

        if (btnLogin) {
            btnLogin.style.display = "block";
        }

        if (btnRegistro) {
            btnRegistro.style.display = "block";
        }

        if (btnMisCompras) {
            btnMisCompras.style.display = "none";
        }

        if (btnMiCuenta) {
            btnMiCuenta.style.display = "none";
        }

        if (btnCerrarSesion) {
            btnCerrarSesion.style.display = "none";
        }
    }
}

// ===============================
// PUBLICAR PRODUCTO
// ===============================

function abrirProductoModal() {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Debes iniciar sesión para publicar un producto.");

        abrirLogin();

        return;
    }

    document.getElementById("productoModal").style.display = "flex";

}


// ===============================
// CERRAR MODAL PRODUCTO
// ===============================

function cerrarProductoModal() {

    const modal = document.getElementById("productoModal");

    modal.style.display = "none";

    document.getElementById("formProducto").reset();

    document.getElementById("mensajeProducto").textContent = "";

}


// ===============================
// PUBLICAR PRODUCTO
// ===============================
async function publicarProducto(event) {

    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Debes iniciar sesión para publicar un producto.");

        cerrarProductoModal();

        abrirLogin();

        return;
    }


    const nombre =
        document.getElementById("productoNombre").value.trim();

    const descripcion =
        document.getElementById("productoDescripcion").value.trim();

    const precio =
        Number(document.getElementById("productoPrecio").value);

    const categoria =
        document.getElementById("productoCategoria").value.trim();

    const stock =
        Number(document.getElementById("productoStock").value);

    const archivoImagen =
        document.getElementById("productoImagen").files[0];

    const mensaje =
        document.getElementById("mensajeProducto");


    // ===============================
    // VALIDAR DATOS
    // ===============================

    if (
        !nombre ||
        !descripcion ||
        !categoria ||
        precio < 0 ||
        stock < 1
    ) {

        mensaje.textContent =
            "❌ Completa correctamente todos los campos.";

        return;
    }


    if (!archivoImagen) {

        mensaje.textContent =
            "❌ Debes seleccionar una imagen.";

        return;
    }


    // ===============================
    // CREAR FORM DATA
    // ===============================

    const formulario = new FormData();

    formulario.append("nombre", nombre);

    formulario.append("descripcion", descripcion);

    formulario.append("precio", precio);

    formulario.append("categoria", categoria);

    formulario.append("stock", stock);

    formulario.append("imagen", archivoImagen);


    mensaje.textContent =
        "⏳ Publicando producto...";


    try {

        const respuesta = await fetch(
            `${API_URL}/productos`,
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${token}`
                },

                body: formulario
            }
        );


        const datos = await respuesta.json();


        // ===============================
        // SESIÓN EXPIRADA
        // ===============================

        if (respuesta.status === 401) {

            localStorage.removeItem("token");

            localStorage.removeItem("usuario");

            actualizarBotonesUsuario();

            cerrarProductoModal();

            alert(
                "Tu sesión ha expirado. Inicia sesión nuevamente."
            );

            abrirLogin();

            return;
        }


        // ===============================
        // ERROR
        // ===============================

        if (!respuesta.ok) {

            mensaje.textContent =
                `❌ ${
                    datos.mensaje ||
                    "No se pudo publicar el producto."
                }`;

            return;
        }


        // ===============================
        // ÉXITO
        // ===============================

        mensaje.textContent =
            "✅ Producto publicado correctamente.";


        await obtenerProductos();


        setTimeout(() => {

            cerrarProductoModal();

        }, 1000);


    } catch (error) {

        console.error(
            "Error publicando producto:",
            error
        );

        mensaje.textContent =
            "❌ Error de conexión con el servidor.";

    }

}

// =====================================================
// OBTENER PRODUCTOS
// =====================================================

async function obtenerProductos() {

    try {

        const respuesta = await fetch(
            `${API_URL}/productos`
        );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los productos."
            );
        }


        const productos =
            await respuesta.json();


        console.log(
            "PRODUCTOS RECIBIDOS:",
            productos
        );


        mostrarProductos(productos);

    } catch (error) {

        console.error(
            "Error obteniendo productos:",
            error
        );
    }
}


// =====================================================
// MOSTRAR PRODUCTOS
// =====================================================

function mostrarProductos(productos) {

    productosGlobales = productos;

    const contenedor =
        document.getElementById("listaProductos");


    if (!contenedor) {

        console.error(
            "No existe #listaProductos"
        );

        return;
    }


    contenedor.innerHTML = "";


    if (!productos || productos.length === 0) {

        contenedor.innerHTML =
            "<p>No hay productos disponibles.</p>";

        return;
    }


    productos.forEach(producto => {

        const tarjeta =
            document.createElement("div");


        tarjeta.classList.add(
            "producto"
        );


        tarjeta.innerHTML = `

            <img
                src="${API_URL}/uploads/${producto.imagen}"
                alt="${producto.nombre}"
                onerror="this.style.display='none'"
            >

            <div class="producto-contenido">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.descripcion}
                </p>

                <p class="precio">
                    $${Number(producto.precio)
                        .toLocaleString("es-CO")}
                </p>

                <p class="categoria">
                    <strong>Categoría:</strong>
                    ${producto.categoria}
                </p>

                <p class="stock">
                    <strong>Stock:</strong>
                    ${producto.stock}
                </p>

                <button
                    type="button"
                    onclick="verProducto('${producto._id}')"
                >
                    Ver producto
                </button>

            </div>
        `;


        contenedor.appendChild(
            tarjeta
        );
    });
}


// =====================================================
// VER PRODUCTO
// =====================================================

function verProducto(id) {

    const producto =
        productosGlobales.find(
            producto =>
                producto._id === id
        );


    if (!producto) {

        console.error(
            "Producto no encontrado:",
            id
        );

        return;
    }


    const detalle =
        document.getElementById(
            "detalleProducto"
        );


    if (!detalle) {

        console.error(
            "No existe #detalleProducto"
        );

        return;
    }


    detalle.innerHTML = `

        <div class="detalle-contenido">

            <button
                type="button"
                class="cerrar-detalle"
                onclick="cerrarDetalle()"
            >
                ×
            </button>

            <img
                src="${API_URL}/uploads/${producto.imagen}"
                alt="${producto.nombre}"
            >

            <h2>
                ${producto.nombre}
            </h2>

            <p>
                ${producto.descripcion}
            </p>

            <p class="precio">
                $${Number(producto.precio)
                    .toLocaleString("es-CO")}
            </p>

            <p>
                <strong>Categoría:</strong>
                ${producto.categoria}
            </p>

            <p>
                <strong>Stock:</strong>
                ${producto.stock}
            </p>

            <button
                type="button"
                class="btn-comprar"
                onclick="comprarProducto('${producto._id}')"
            >
                🛒 Comprar
            </button>

        </div>
    `;


    detalle.style.display =
        "flex";
}


// =====================================================
// CERRAR DETALLE
// =====================================================

function cerrarDetalle() {

    const detalle =
        document.getElementById(
            "detalleProducto"
        );


    if (detalle) {

        detalle.style.display =
            "none";
    }
}


// =====================================================
// COMPRAR / AGREGAR AL CARRITO
// =====================================================

function comprarProducto(id) {

    const producto =
        productosGlobales.find(
            producto =>
                producto._id === id
        );


    if (!producto) {

        console.error(
            "Producto no encontrado:",
            id
        );

        return;
    }


    if (Number(producto.stock) <= 0) {

        alert(
            "❌ Este producto no tiene stock disponible."
        );

        return;
    }


    const productoExistente =
        carrito.find(
            item =>
                item._id === id
        );


    if (productoExistente) {

        if (
            productoExistente.cantidad >=
            Number(producto.stock)
        ) {

            alert(
                "⚠️ No puedes agregar más unidades que el stock disponible."
            );

            return;
        }


        productoExistente.cantidad += 1;

    } else {

        carrito.push({

            ...producto,

            cantidad: 1

        });
    }


    console.log(
        "🛒 CARRITO ACTUAL:",
        carrito
    );


    alert(
        `${producto.nombre} fue agregado al carrito`
    );
}


// =====================================================
// MOSTRAR CARRITO
// =====================================================

function mostrarCarrito() {

    const carritoElemento =
        document.getElementById(
            "carrito"
        );

    const lista =
        document.getElementById(
            "listaCarrito"
        );

    const totalElemento =
        document.getElementById(
            "totalCarrito"
        );


    if (
        !carritoElemento ||
        !lista ||
        !totalElemento
    ) {

        console.error(
            "ERROR: Elementos del carrito no encontrados."
        );

        return;
    }


    lista.innerHTML = "";


    if (carrito.length === 0) {

        lista.innerHTML =
            "<p>El carrito está vacío.</p>";

        totalElemento.innerHTML =
            "Total: $0";

        carritoElemento.style.display =
            "flex";

        return;
    }


    let total = 0;


    carrito.forEach(
        (producto, index) => {

            const cantidad =
                Number(producto.cantidad) || 1;

            const precio =
                Number(producto.precio) || 0;

            const subtotal =
                precio * cantidad;


            total += subtotal;


            const item =
                document.createElement("div");


            item.classList.add(
                "item-carrito"
            );


            item.innerHTML = `

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    Precio:
                    $${precio.toLocaleString("es-CO")}
                </p>

                <div class="cantidad-carrito">

                    <button
                        type="button"
                        onclick="disminuirCantidad(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${cantidad}
                    </span>

                    <button
                        type="button"
                        onclick="aumentarCantidad(${index})"
                    >
                        +
                    </button>

                </div>

                <p>
                    Subtotal:
                    <strong>
                        $${subtotal.toLocaleString("es-CO")}
                    </strong>
                </p>

                <button
                    type="button"
                    onclick="eliminarDelCarrito(${index})"
                >
                    Eliminar
                </button>
            `;


            lista.appendChild(
                item
            );
        }
    );


    totalElemento.innerHTML = `
        Total:
        $${total.toLocaleString("es-CO")}
    `;


    carritoElemento.style.display =
        "flex";
}


// ===============================
// MEDIO DE PAGO
// ===============================

function abrirPagoModal() {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Debes iniciar sesión para realizar una compra.");

        abrirLogin();

        return;
    }

    document.getElementById("pagoModal").style.display = "flex";
}


function cerrarPagoModal() {

    const modal =
        document.getElementById("pagoModal");

    modal.style.display = "none";


    // Limpiar selección

    const opciones =
        document.querySelectorAll(
            'input[name="medioPago"]'
        );

    opciones.forEach(opcion => {

        opcion.checked = false;

    });


    document.getElementById(
        "mensajePago"
    ).textContent = "";

}


// ===============================
// CONTINUAR CON EL PAGO
// ===============================

function continuarPago() {

    const opcionSeleccionada =
        document.querySelector(
            'input[name="medioPago"]:checked'
        );

    const mensaje =
        document.getElementById(
            "mensajePago"
        );


    // ===============================
    // VALIDAR MEDIO DE PAGO
    // ===============================

    if (!opcionSeleccionada) {

        mensaje.textContent =
            "⚠️ Selecciona un medio de pago.";

        return;
    }


    const medioPago =
        opcionSeleccionada.value;


    // ===============================
    // MOSTRAR MEDIO SELECCIONADO
    // ===============================

    if (medioPago === "tarjeta") {

        mensaje.textContent =
            "💳 Has seleccionado pago con Tarjeta.";

    } else if (medioPago === "nequi") {

        mensaje.textContent =
            "📱 Has seleccionado pago con Nequi.";

    } else if (medioPago === "breb") {

        mensaje.textContent =
            "📱 Has seleccionado pago con Llave Bre-B.";
    }


    console.log(
        "MEDIO DE PAGO SELECCIONADO:",
        medioPago
    );


    // ===============================
    // CONTINUAR CON LA COMPRA
    // ===============================

    confirmarCompra();

}



// =====================================================
// AUMENTAR CANTIDAD
// =====================================================

function aumentarCantidad(index) {

    if (!carrito[index]) {
        return;
    }


    const producto =
        carrito[index];


    const stock =
        Number(producto.stock);


    if (
        stock > 0 &&
        producto.cantidad >= stock
    ) {

        alert(
            "⚠️ No puedes superar el stock disponible."
        );

        return;
    }


    producto.cantidad += 1;

    mostrarCarrito();
}


// =====================================================
// DISMINUIR CANTIDAD
// =====================================================

function disminuirCantidad(index) {

    if (!carrito[index]) {
        return;
    }


    if (carrito[index].cantidad > 1) {

        carrito[index].cantidad -= 1;

    } else {

        carrito.splice(index, 1);
    }


    mostrarCarrito();
}


// =====================================================
// ELIMINAR DEL CARRITO
// =====================================================

function eliminarDelCarrito(index) {

    if (!carrito[index]) {
        return;
    }


    carrito.splice(
        index,
        1
    );


    mostrarCarrito();
}


// =====================================================
// FINALIZAR COMPRA
// =====================================================

function finalizarCompra() {

    if (carrito.length === 0) {

        alert(
            "🛒 El carrito está vacío."
        );

        return;
    }


    const token =
        obtenerToken();


    if (!token) {

        alert(
            "⚠️ Debes iniciar sesión para realizar una compra."
        );

        abrirLogin();

        return;
    }


    let total = 0;
    let cantidadTotal = 0;


    carrito.forEach(producto => {

        const cantidad =
            Number(producto.cantidad) || 1;

        const precio =
            Number(producto.precio) || 0;


        cantidadTotal += cantidad;

        total += precio * cantidad;
    });


    const confirmacion =
        document.getElementById(
            "confirmacionCompra"
        );

    const resumen =
        document.getElementById(
            "resumenCompra"
        );


    if (
        !confirmacion ||
        !resumen
    ) {

        console.error(
            "No existe la ventana de confirmación."
        );

        return;
    }


    resumen.innerHTML = `

        Tienes
        <strong>
            ${cantidadTotal}
        </strong>
        producto(s) en tu carrito.

        <br><br>

        Total de la compra:

        <strong>
            $${total.toLocaleString("es-CO")}
        </strong>
    `;


    confirmacion.style.display =
        "flex";
}


// =====================================================
// CERRAR CONFIRMACIÓN
// =====================================================

function cerrarConfirmacion() {

    const confirmacion =
        document.getElementById(
            "confirmacionCompra"
        );


    if (confirmacion) {

        confirmacion.style.display =
            "none";
    }
}

// =====================================================
// CONFIRMAR COMPRA
// =====================================================

async function confirmarCompra() {

    if (carrito.length === 0) {

        alert(
            "🛒 El carrito está vacío."
        );

        return;
    }


    const token =
        obtenerToken();


    if (!token) {

        alert(
            "⚠️ Debes iniciar sesión para realizar una compra."
        );

        cerrarConfirmacion();

        abrirLogin();

        return;
    }


    // =====================================================
    // OBTENER MEDIO DE PAGO SELECCIONADO
    // =====================================================

    const opcionSeleccionada =
        document.querySelector(
            'input[name="medioPago"]:checked'
        );


    if (!opcionSeleccionada) {

        alert(
            "⚠️ Debes seleccionar un medio de pago."
        );

        return;
    }


    const medioPago =
        opcionSeleccionada.value;


    console.log(
        "💳 MEDIO DE PAGO:",
        medioPago
    );


    try {

        const respuesta =
            await fetch(
                `${API_URL}/compras`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        productos:
                            carrito.map(producto => ({

                                _id:
                                    producto._id,

                                nombre:
                                    producto.nombre,

                                imagen:
                                    producto.imagen,

                                precio:
                                    producto.precio,

                                cantidad:
                                    producto.cantidad
                            })),

                        // ===============================
                        // MEDIO DE PAGO
                        // ===============================

                        medioPago:
                            medioPago
                    })
                }
            );


        const datos =
            await respuesta.json();


        console.log(
            "RESPUESTA DEL SERVIDOR:",
            datos
        );


        // =====================================================
        // ERROR
        // =====================================================

        if (!respuesta.ok) {

            if (respuesta.status === 401) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "usuario"
                );


                alert(
                    "⚠️ Tu sesión ha expirado. Debes iniciar sesión nuevamente."
                );


                cerrarConfirmacion();

                cerrarPagoModal();

                abrirLogin();

                actualizarBotonesUsuario();

                return;
            }


            alert(
                datos.mensaje ||
                "❌ No se pudo registrar la compra."
            );

            return;
        }


        // =====================================================
        // COMPRA REGISTRADA
        // =====================================================

        alert(
            "✅ Compra registrada correctamente."
        );


        carrito = [];


        // Cerrar ventanas

        cerrarConfirmacion();

        cerrarPagoModal();

        cerrarCarrito();


    } catch (error) {

        console.error(
            "Error registrando compra:",
            error
        );


        alert(
            "❌ Error de conexión con el servidor."
        );
    }
}


// =====================================================
// CERRAR CARRITO
// =====================================================

function cerrarCarrito() {

    const carritoElemento =
        document.getElementById(
            "carrito"
        );


    if (carritoElemento) {

        carritoElemento.style.display =
            "none";
    }
}


// =====================================================
// MOSTRAR MIS COMPRAS
// =====================================================

async function mostrarMisCompras() {

    console.log(
        "🧾 ABRIENDO MIS COMPRAS"
    );


    const ventana =
        document.getElementById(
            "misCompras"
        );

    const lista =
        document.getElementById(
            "listaMisCompras"
        );


    if (
        !ventana ||
        !lista
    ) {

        console.error(
            "ERROR: Elementos de Mis Compras no encontrados."
        );

        return;
    }


    const token =
        obtenerToken();


    if (!token) {

        ventana.style.display =
            "flex";


        lista.innerHTML = `
            <p>
                ⚠️ Debes iniciar sesión para ver tus compras.
            </p>
        `;

        return;
    }


    lista.innerHTML = `
        <p>
            Cargando compras...
        </p>
    `;


    ventana.style.display =
        "flex";


    try {

        const respuesta =
            await fetch(
                `${API_URL}/compras`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const compras =
            await respuesta.json();


        console.log(
            "🧾 COMPRAS RECIBIDAS:",
            compras
        );


        if (respuesta.status === 401) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "usuario"
            );


            lista.innerHTML = `
                <p>
                    ⚠️ Tu sesión ha expirado.
                    Debes iniciar sesión nuevamente.
                </p>
            `;


            actualizarBotonesUsuario();

            return;
        }


        if (!respuesta.ok) {

            throw new Error(
                compras.mensaje ||
                "Error obteniendo compras."
            );
        }


        lista.innerHTML = "";


        if (
            !compras ||
            compras.length === 0
        ) {

            lista.innerHTML = `
                <p>
                    No tienes compras registradas.
                </p>
            `;

            return;
        }


        compras.forEach(compra => {

            const compraElemento =
                document.createElement(
                    "div"
                );


            compraElemento.classList.add(
                "compra-item"
            );


            let productosHTML = "";


            // =====================================================
            // PRODUCTOS DE LA COMPRA
            // =====================================================

            if (
                compra.productos &&
                compra.productos.length > 0
            ) {

                compra.productos.forEach(
                    producto => {

                        const productoOriginal =
                            productosGlobales.find(
                                p =>
                                    p._id ===
                                    (
                                        producto.producto ||
                                        producto._id
                                    )
                            );


                        const imagen =
                            producto.imagen ||
                            productoOriginal?.imagen ||
                            "licuadora.jpg";


                        const precio =
                            Number(
                                producto.precio
                            ) || 0;


                        const cantidad =
                            Number(
                                producto.cantidad
                            ) || 1;


                        const subtotal =
                            producto.subtotal != null
                                ? Number(
                                    producto.subtotal
                                )
                                : precio * cantidad;


                        productosHTML += `

                            <div class="producto-compra">

                                <img
                                    class="imagen-compra"
                                    src="${API_URL}/uploads/${imagen}"
                                    alt="${producto.nombre}"
                                >

                                <div
                                    class="producto-compra-info"
                                >

                                    <h3>
                                        ${producto.nombre}
                                    </h3>

                                    <p>
                                        Precio:
                                        $${precio.toLocaleString(
                                            "es-CO"
                                        )}
                                    </p>

                                    <p>
                                        Cantidad:
                                        <strong>
                                            ${cantidad}
                                        </strong>
                                    </p>

                                    <p>
                                        Subtotal:
                                        <strong>
                                            $${subtotal.toLocaleString(
                                                "es-CO"
                                            )}
                                        </strong>
                                    </p>

                                </div>

                            </div>
                        `;
                    }
                );
            }


            // =====================================================
            // MEDIO DE PAGO
            // =====================================================

            const medioPago =
                compra.medioPago ||
                "No especificado";


            let medioPagoTexto =
                medioPago;


            if (
                medioPago === "tarjeta"
            ) {

                medioPagoTexto =
                    "💳 Tarjeta";

            } else if (
                medioPago === "nequi"
            ) {

                medioPagoTexto =
                    "📱 Nequi";

            } else if (
                medioPago === "breb"
            ) {

                medioPagoTexto =
                    "📱 Llave Bre-B";
            }


            // =====================================================
            // ESTADO
            // =====================================================

            const estado =
                compra.estado ||
                "Pendiente";


            // =====================================================
            // FECHA
            // =====================================================

            const fecha =
                compra.fecha
                    ? new Date(
                        compra.fecha
                    ).toLocaleDateString(
                        "es-CO"
                    )
                    : "Sin fecha";


            // =====================================================
            // TOTAL
            // =====================================================

            const total =
                Number(
                    compra.total
                ) || 0;


            // =====================================================
            // MOSTRAR COMPRA
            // =====================================================

            compraElemento.innerHTML = `

                <div class="compra-cabecera">

                    <strong>
                        🛍️ Compra
                    </strong>

                    <span>
                        ${fecha}
                    </span>

                </div>


                ${productosHTML}


                <div class="compra-total">

                    Total:
                    $${total.toLocaleString(
                        "es-CO"
                    )}

                </div>


                <div class="compra-medio-pago">

                    Medio de pago:

                    <strong>
                        ${medioPagoTexto}
                    </strong>

                </div>


                <div
                    class="
                        compra-estado
                        estado-${estado.toLowerCase()}
                    "
                >

                    Estado:

                    <strong>
                        ${estado}
                    </strong>

                </div>
            `;


            lista.appendChild(
                compraElemento
            );

        });


    } catch (error) {

        console.error(
            "Error cargando mis compras:",
            error
        );


        lista.innerHTML = `
            <p>
                ❌ Error al cargar las compras.
            </p>
        `;
    }
}





// =====================================================
// CERRAR MIS COMPRAS
// =====================================================

function cerrarMisCompras() {

    const ventana =
        document.getElementById(
            "misCompras"
        );


    if (ventana) {

        ventana.style.display =
            "none";
    }
}


// =====================================================
// IR A PRODUCTOS
// =====================================================

function irProductos() {

    const productos =
        document.getElementById(
            "productos"
        );


    if (productos) {

        productos.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// =====================================================
// EVENTOS CUANDO CARGA LA PÁGINA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // -----------------------------------------
        // BOTÓN CARRITO
        // -----------------------------------------

        const btnCarrito =
            document.getElementById(
                "btnCarrito"
            );


        if (btnCarrito) {

            btnCarrito.addEventListener(
                "click",
                mostrarCarrito
            );
        }


        // -----------------------------------------
        // BOTÓN LOGIN
        // -----------------------------------------

        const btnLogin =
            document.getElementById(
                "btnLogin"
            );


        if (btnLogin) {

            btnLogin.addEventListener(
                "click",
                abrirLogin
            );
        }


        // -----------------------------------------
        // BOTÓN REGISTRO
        // -----------------------------------------

        const btnRegistro =
            document.getElementById(
                "btnRegistro"
            );


        if (btnRegistro) {

            btnRegistro.addEventListener(
                "click",
                abrirRegistro
            );
        }


        // -----------------------------------------
        // BOTÓN MI CUENTA
        // -----------------------------------------

        const btnMiCuenta =
            document.getElementById(
                "btnMiCuenta"
            );


        if (btnMiCuenta) {

            btnMiCuenta.addEventListener(
                "click",
                abrirMiCuenta
            );
        }


        // -----------------------------------------
        // BOTÓN CAMBIAR CONTRASEÑA
        // -----------------------------------------

        const btnMostrarCambioPassword =
            document.getElementById(
                "btnMostrarCambioPassword"
            );


        if (btnMostrarCambioPassword) {

            btnMostrarCambioPassword.addEventListener(
                "click",
                mostrarCambioPassword
            );
        }


        // -----------------------------------------
        // FORMULARIO CAMBIAR CONTRASEÑA
        // -----------------------------------------

        const formCambiarPassword =
            document.getElementById(
                "formCambiarPassword"
            );


        if (formCambiarPassword) {

            formCambiarPassword.addEventListener(
                "submit",
                cambiarPassword
            );
        }


        // -----------------------------------------
        // FORMULARIO REGISTRO
        // -----------------------------------------

        const formRegistro =
            document.getElementById(
                "formRegistro"
            );


        if (formRegistro) {

            formRegistro.addEventListener(
                "submit",
                registrarUsuario
            );
        }


        // -----------------------------------------
        // FORMULARIO LOGIN
        // -----------------------------------------

        const formLogin =
            document.getElementById(
                "formLogin"
            );


        if (formLogin) {

            formLogin.addEventListener(
                "submit",
                iniciarSesion
            );
        }


        // -----------------------------------------
        // BOTÓN MIS COMPRAS
        // -----------------------------------------

        const btnMisCompras =
            document.getElementById(
                "btnMisCompras"
            );


        if (btnMisCompras) {

            btnMisCompras.addEventListener(
                "click",
                mostrarMisCompras
            );
        }


        // -----------------------------------------
        // BOTÓN CERRAR SESIÓN
        // -----------------------------------------
        const btnCerrarSesion =
            document.getElementById(
                "btnCerrarSesion"
            );


        if (btnCerrarSesion) {

            btnCerrarSesion.addEventListener(
                "click",
                cerrarSesion
            );
        }


        // -----------------------------------------
        // BOTÓN PUBLICAR SERVICIO
        // -----------------------------------------

        const btnPublicarServicio =
            document.getElementById(
                "btnPublicarServicio"
            );


        // =========================================
// BOTÓN PUBLICAR SERVICIO
// =========================================

if (btnPublicarServicio) {

    btnPublicarServicio.addEventListener(
        "click",
        abrirServicioModal
    );

}

// ===============================
// PUBLICAR PRODUCTO
// ===============================

const btnPublicarProducto =
    document.getElementById("btnPublicarProducto");

if (btnPublicarProducto) {

    btnPublicarProducto.addEventListener(
        "click",
        abrirProductoModal
    );

}


const formProducto =
    document.getElementById("formProducto");

if (formProducto) {

    formProducto.addEventListener(
        "submit",
        publicarProducto
    );

}


    



// =========================================
// FORMULARIO PUBLICAR SERVICIO
// =========================================

const formServicio =
    document.getElementById("formServicio");

if (formServicio) {

    formServicio.addEventListener(
        "submit",
        publicarServicio
    );

}


// =========================================
// ACTUALIZAR BOTONES DEL USUARIO
// =========================================

actualizarBotonesUsuario();

});
// =====================================================
// CERRAR DETALLE AL HACER CLIC AFUERA
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const detalle =
            document.getElementById(
                "detalleProducto"
            );


        if (
            detalle &&
            event.target === detalle
        ) {

            cerrarDetalle();
        }
    }
);


// =====================================================
// INICIAR APLICACIÓN
// =====================================================

obtenerProductos();
console.log("✅ app.js cargado correctamente");
