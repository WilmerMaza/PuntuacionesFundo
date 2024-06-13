"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getventsAction = exports.eventAction = exports.obtenerRegistrosPorDeportistaId = exports.actualizarIntentos = exports.crearRegistro = void 0;
const registroService = __importStar(require("../service/Service_puntaciones"));
const mongoose_1 = __importDefault(require("mongoose"));
const evento_service_1 = require("../service/evento_service");
const crearRegistro = async (req, res) => {
    try {
        const resultado = await registroService.crearRegistro(req.body);
        console.log(resultado);
        res.status(201).send(resultado);
    }
    catch (error) {
        res.status(400).send(error);
    }
};
exports.crearRegistro = crearRegistro;
const actualizarIntentos = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).send('ID de registro inválido');
            return;
        }
        const intento = req.body;
        const result = await registroService.agregarIntento(id, intento);
        if (!result) {
            res.status(404).send('Registro no encontrado');
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error al actualizar los intentos:', error);
        res.status(500).send('Error interno del servidor');
    }
};
exports.actualizarIntentos = actualizarIntentos;
const obtenerRegistrosPorDeportistaId = async (req, res) => {
    try {
        const { deportistaId } = req.params;
        const registros = await registroService.obtenerRegistrosPorDeportistaId(deportistaId);
        res.status(200).json(registros);
    }
    catch (error) {
        console.error('Error al obtener los registros del deportista:', error);
        res.status(500).send('Error interno del servidor');
    }
};
exports.obtenerRegistrosPorDeportistaId = obtenerRegistrosPorDeportistaId;
const eventAction = async (req, res) => {
    try {
        const { params: { event, partidaId, platform }, body } = req;
        const request = { event, partidaId, platform, body };
        await evento_service_1.eventoService.actionEvento(request);
        res.status(200).json({ message: "Event iniciado" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al enviar el evento" });
    }
};
exports.eventAction = eventAction;
const getventsAction = (req, res) => {
    const { params: { partidaId, platform }, } = req;
    evento_service_1.eventoService.addClient(partidaId, res, platform);
};
exports.getventsAction = getventsAction;
//# sourceMappingURL=puntaciones_controller.js.map