const express = require('express');
const router = express.Router();

const Contratacion = require('../models/contratacion');
const Service = require('../models/Service');

// Middleware de autenticación
const auth = require('../middleware/auth');

// =====================================================
// SOLICITAR UN SERVICIO
// =====================================================

router.post('/solicitar/:servicioId', auth, async (req, res) => {

    try {

        const { servicioId } = req.params;
        const { mensaje } = req.body;

        // Buscar el servicio
        const servicio = await Service.findById(servicioId);

        if (!servicio) {
            return res.status(404).json({
                mensaje: 'Servicio no encontrado'
            });
        }

        // Verificar que el servicio esté disponible
        if (servicio.estado !== 'Disponible') {
            return res.status(400).json({
                mensaje: 'Este servicio no está disponible actualmente'
            });
        }

        // Obtener usuario autenticado
        const clienteId = req.usuario.id;

        // No permitir que el dueño contrate su propio servicio
        if (servicio.usuario.toString() === clienteId.toString()) {
            return res.status(400).json({
                mensaje: 'No puedes contratar tu propio servicio'
            });
        }

        // Crear contratación
        const contratacion = new Contratacion({

            servicio: servicio._id,

            proveedor: servicio.usuario,

            cliente: clienteId,

            precio: servicio.precio,

            mensaje: mensaje || '',

            estado: 'Pendiente'

        });

        await contratacion.save();

        console.log('✅ CONTRATACIÓN CREADA:', contratacion);

        res.status(201).json({
            mensaje: 'Solicitud de servicio enviada correctamente',
            contratacion
        });

    } catch (error) {

        console.error('Error al solicitar servicio:', error);

        res.status(500).json({
            mensaje: 'Error al solicitar el servicio',
            error: error.message
        });

    }

});


// =====================================================
// VER SOLICITUDES RECIBIDAS
// =====================================================

router.get('/recibidas', auth, async (req, res) => {

    try {

        const usuarioId = req.usuario.id;


        console.log('🔎 USUARIO QUE CONSULTA SOLICITUDES:', usuarioId);

      
        const contrataciones = await Contratacion.find({
            proveedor: usuarioId
        })
        .populate('servicio')
        .populate('cliente', 'nombres apellidos correo telefono')
        .sort({ fechaSolicitud: -1 });
        
        console.log('📥 SOLICITUDES RECIBIDAS ENCONTRADAS:', contrataciones.length);
       // console.log('📋 DATOS SOLICITUDES:', contrataciones);
       console.log(
    '📋 SOLICITUDES ENCONTRADAS:',
    contrataciones.map(c => ({
        id: c._id,
        proveedor: c.proveedor,
        cliente: c.cliente,
        servicio: c.servicio?._id
    }))
);




        res.json(contrataciones);

    } catch (error) {

        console.error('Error obteniendo solicitudes recibidas:', error);

        res.status(500).json({
            mensaje: 'Error al obtener solicitudes'
        });

    }

});


// =====================================================
// VER SERVICIOS QUE YO SOLICITÉ
// =====================================================

router.get('/mis-solicitudes', auth, async (req, res) => {

    try {

        const usuarioId = req.usuario.id;

        const contrataciones = await Contratacion.find({
            cliente: usuarioId
        })
        .populate('servicio')
        .populate('proveedor', 'nombres apellidos correo telefono')
        .sort({ fechaSolicitud: -1 });

        res.json(contrataciones);

    } catch (error) {

        console.error('Error obteniendo mis solicitudes:', error);

        res.status(500).json({
            mensaje: 'Error al obtener tus solicitudes'
        });

    }

});


// =====================================================
// ACEPTAR SOLICITUD
// =====================================================

router.put('/aceptar/:id', auth, async (req, res) => {

    try {

        const contratacion = await Contratacion.findById(req.params.id);

        if (!contratacion) {
            return res.status(404).json({
                mensaje: 'Contratación no encontrada'
            });
        }

        // Solo el proveedor puede aceptar
        if (contratacion.proveedor.toString() !== req.usuario.id.toString()) {
            return res.status(403).json({
                mensaje: 'No tienes permiso para aceptar esta solicitud'
            });
        }

        if (contratacion.estado !== 'Pendiente') {
            return res.status(400).json({
                mensaje: 'Esta solicitud ya fue procesada'
            });
        }

        contratacion.estado = 'Aceptada';
        contratacion.fechaActualizacion = new Date();

        await contratacion.save();

        res.json({
            mensaje: 'Solicitud aceptada correctamente',
            contratacion
        });

    } catch (error) {

        console.error('Error aceptando solicitud:', error);

        res.status(500).json({
            mensaje: 'Error al aceptar la solicitud'
        });

    }

});


// =====================================================
// RECHAZAR SOLICITUD
// =====================================================

router.put('/rechazar/:id', auth, async (req, res) => {

    try {

        const contratacion = await Contratacion.findById(req.params.id);

        if (!contratacion) {
            return res.status(404).json({
                mensaje: 'Contratación no encontrada'
            });
        }

        // Solo el proveedor puede rechazar
        if (contratacion.proveedor.toString() !== req.usuario.id.toString()) {
            return res.status(403).json({
                mensaje: 'No tienes permiso para rechazar esta solicitud'
            });
        }

        if (contratacion.estado !== 'Pendiente') {
            return res.status(400).json({
                mensaje: 'Esta solicitud ya fue procesada'
            });
        }

        contratacion.estado = 'Rechazada';
        contratacion.fechaActualizacion = new Date();

        await contratacion.save();

        res.json({
            mensaje: 'Solicitud rechazada',
            contratacion
        });

    } catch (error) {

        console.error('Error rechazando solicitud:', error);

        res.status(500).json({
            mensaje: 'Error al rechazar la solicitud'
        });

    }

});


// =====================================================
// FINALIZAR CONTRATACIÓN
// =====================================================

router.put('/finalizar/:id', auth, async (req, res) => {

    try {

        const contratacion = await Contratacion.findById(req.params.id);

        if (!contratacion) {
            return res.status(404).json({
                mensaje: 'Contratación no encontrada'
            });
        }

        const usuarioId = req.usuario.id.toString();

        // Puede finalizar el proveedor o el cliente
        if (
            contratacion.proveedor.toString() !== usuarioId &&
            contratacion.cliente.toString() !== usuarioId
        ) {
            return res.status(403).json({
                mensaje: 'No tienes permiso para finalizar esta contratación'
            });
        }

        if (contratacion.estado !== 'En proceso') {
            return res.status(400).json({
                mensaje: 'La contratación no está en proceso'
            });
        }

        contratacion.estado = 'Finalizada';
        contratacion.fechaActualizacion = new Date();

        await contratacion.save();

        res.json({
            mensaje: 'Contratación finalizada correctamente',
            contratacion
        });

    } catch (error) {

        console.error('Error finalizando contratación:', error);

        res.status(500).json({
            mensaje: 'Error al finalizar la contratación'
        });

    }

});


module.exports = router;