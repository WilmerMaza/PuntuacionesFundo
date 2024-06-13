"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerRegistrosPorDeportistaId = exports.agregarIntento = exports.crearRegistro = void 0;
const models_puntaciones_1 = require("../models/models_puntaciones");
const crearRegistro = async (data) => {
    const nuevoRegistro = new models_puntaciones_1.Registro(data);
    return await nuevoRegistro.save();
};
exports.crearRegistro = crearRegistro;
const agregarIntento = async (registroId, intentoData) => {
    try {
        const registroToUpdate = await models_puntaciones_1.Registro.findByIdAndUpdate(registroId, { $push: { intentos: intentoData } }, { new: true });
        return registroToUpdate;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.agregarIntento = agregarIntento;
const obtenerRegistrosPorDeportistaId = async (deportistaId) => {
    try {
        const registros = await models_puntaciones_1.Registro.find({ deportista_id: deportistaId });
        return registros;
    }
    catch (error) {
        console.error('Error al obtener los registros del deportista:', error);
        return [];
    }
};
exports.obtenerRegistrosPorDeportistaId = obtenerRegistrosPorDeportistaId;
//# sourceMappingURL=Service_puntaciones.js.map