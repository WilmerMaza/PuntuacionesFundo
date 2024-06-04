import { Router } from 'express';
import * as registroController from '../controllers/puntaciones_controller';

const router = Router();

router.post('/crearRegistro', registroController.crearRegistro);
router.put('/actualizarIntentos/:id', registroController.actualizarIntentos);
router.get('/porDeportista/:deportistaId', registroController.obtenerRegistrosPorDeportistaId);



export default router;

