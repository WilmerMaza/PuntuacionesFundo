import { Request, Response } from 'express';
import { obtenerRegistrosPorPartidaId } from '../service/Service_puntaciones';
import { generarPDFInformeBase64 } from '../service/generatePDF';
import { RegistroDocument } from '../models/models_puntaciones';

export const descargarInforme = async (req: Request, res: Response): Promise<void> => {
    try {
        const { partidaId } = req.params;
        const registros = await obtenerRegistrosPorPartidaId(partidaId);

        const obtenerPesoMaximoExitoso = (registro: RegistroDocument) => {
            let pesoMaximo = -Infinity;
            for (const intento of registro.intentos) {
                if (intento.resultado === 'Éxito' && parseFloat(intento.peso.toString()) > pesoMaximo) {
                    pesoMaximo = parseFloat(intento.peso.toString());
                }
            }
            return pesoMaximo;
        };

        const filtrarYOrdenarRegistros = (tipo: string) => {
            return registros
                .filter(registro => registro.tipo === tipo)
                .sort((registroA, registroB) => {
                    const pesoMaximoA = obtenerPesoMaximoExitoso(registroA);
                    const pesoMaximoB = obtenerPesoMaximoExitoso(registroB);
                    return pesoMaximoB - pesoMaximoA;
                });
        };

        const registrosEnvion = filtrarYOrdenarRegistros('Envión');
        const registrosArranque = filtrarYOrdenarRegistros('Arranque');

        // Generar PDF en base a los registros ordenados
        const pdfBase64 = await generarPDFInformeBase64(registrosEnvion, registrosArranque);
        res.status(200).json({ base64: pdfBase64 });
    } catch (error) {
        console.error('Error al generar el informe PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
};
