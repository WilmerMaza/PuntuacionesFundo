import { Request, Response } from 'express';
import { obtenerRegistrosPorPartidaId } from '../service/Service_puntaciones';
import { generarPDFInformeBase64 } from '../service/generatePDF';

export const descargarInforme = async (req: Request, res: Response): Promise<void> => {
    try {
        const { partidaId } = req.params;
        const registros = await obtenerRegistrosPorPartidaId(partidaId);

        const registrosEnvion = registros.filter(r => r.tipo === 'Envión').sort((a, b) => {
            const pesoA = Math.max(...a.intentos.filter(i => i.resultado === 'Éxito').map(i => parseFloat(i.peso.toString())));
            const pesoB = Math.max(...b.intentos.filter(i => i.resultado === 'Éxito').map(i => parseFloat(i.peso.toString())));
            return pesoB - pesoA;
        });

        const registrosArranque = registros.filter(r => r.tipo === 'Arranque').sort((a, b) => {
            const pesoA = Math.max(...a.intentos.filter(i => i.resultado === 'Éxito').map(i => parseFloat(i.peso.toString())));
            const pesoB = Math.max(...b.intentos.filter(i => i.resultado === 'Éxito').map(i => parseFloat(i.peso.toString())));
            return pesoB - pesoA;
        });

        const pdfBase64 = await generarPDFInformeBase64(registrosEnvion, registrosArranque);
        res.status(200).json({ base64: pdfBase64 });
    } catch (error) {
        console.error('Error al generar el informe PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
};