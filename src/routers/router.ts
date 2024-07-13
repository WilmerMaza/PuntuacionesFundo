
import { Router } from 'express';
import { descargarInforme } from '../controllers/generacionPdf_controllers';
import * as registroController from '../controllers/puntaciones_controller';


const router = Router();

router.post('/puntaciones/create', registroController.crearRegistroController);
router.put('/puntaciones/ActualizacionPeso/:deportista_id', registroController.actualizarIntentos);
router.get('/puntaciones/partida/:partidaId', registroController.obtenerRegistrosPorPartidaId);
router.post("/puntaciones/:platform/:event/:partidaId", registroController.eventAction);
router.get("/puntaciones/:platform/:partidaId", registroController.geteventsAction);
router.get('/registros/:partidaId/descargar-informe', descargarInforme);
export default router;
