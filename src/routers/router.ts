import { Router } from 'express';
import * as registroController from '../controllers/puntaciones_controller';

const router = Router();

router.post('/createRegister', registroController.crearRegistro);
router.put('/actualizarIntentos/:id', registroController.actualizarIntentos);
router.get('/porDeportista/:deportistaId', registroController.obtenerRegistrosPorDeportistaId);
router.post("/evento/:platform/:event/:partidaId", registroController.eventAction);
router.get("/evento/:platform/:partidaId", registroController.getventsAction);



export default router;

