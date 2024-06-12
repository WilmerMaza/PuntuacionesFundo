import { Router } from 'express';
import * as registroController from '../controllers/puntaciones_controller';

const router = Router();

router.post('/crearRegistro', registroController.crearRegistro);
router.put('/actualizarIntentos/:id', registroController.actualizarIntentos);
router.get('/porDeportista/:deportistaId', registroController.obtenerRegistrosPorDeportistaId);
router.post("/cronometro/:platform/:event/:partidaId", registroController.eventCronometro );
router.get("/cronometro/:platform/:partidaId", registroController.getCronometroEvents);




export default router;

