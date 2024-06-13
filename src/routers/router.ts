import { Router } from 'express';
import * as registroController from '../controllers/puntaciones_controller';

const router = Router();

router.post('/puntaciones/create', registroController.crearRegistro);
router.put('/puntaciones/intentos/:id', registroController.actualizarIntentos);
router.get('/puntaciones/deportista/:deportistaId', registroController.obtenerRegistrosPorDeportistaId);
router.post("/puntaciones/:platform/:event/:partidaId", registroController.eventAction);
router.get("/puntaciones/:platform/:partidaId", registroController.geteventsAction);

export default router;
