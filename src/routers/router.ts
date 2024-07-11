import { Router } from 'express';
import * as registroController from '../controllers/puntaciones_controller';
import {descargarInforme}  from '../controllers/generacionPdf_controllers';


const router = Router();

router.post('/puntaciones/create', registroController.crearRegistroController);
router.put('/actualizar-peso', registroController.actualizarPesoController);
router.post("/puntaciones/:platform/:event/:partidaId", registroController.eventAction);
router.get("/puntaciones/:platform/:partidaId", registroController.geteventsAction);
router.get('/registros/:partidaId/descargar-informe',descargarInforme );

export default router;
