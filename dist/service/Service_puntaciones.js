"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearRegistro = void 0;
const models_puntaciones_1 = require("../models/models_puntaciones");
const crearRegistro = async (data) => {
    const nuevoRegistro = new models_puntaciones_1.Registro(data);
    return await nuevoRegistro.save();
};
exports.crearRegistro = crearRegistro;
//# sourceMappingURL=Service_puntaciones.js.map