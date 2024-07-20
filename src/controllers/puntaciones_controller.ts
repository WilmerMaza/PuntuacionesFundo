import { Request, Response } from 'express';
import { RegistroDocument } from '../models/models_puntaciones';
import { RequestEventData } from "../models/RequestEventData";
import { eventoService } from "../service/evento_service";
import { actualizarPesoIntento, crearRegistro, obtenerRegistrosPorPartidaId as obtenerPartida } from '../service/Service_puntaciones';

export const crearRegistroController = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevoRegistro = req.body as RegistroDocument;
    const resultado = await crearRegistro(nuevoRegistro);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear o actualizar el registro:', error);
    res.status(400).json({ error: error });
  }
};


export const actualizarIntentos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deportista_id } = req.params;
    const { peso, partidaId, tipo } = req.body; 
    
    const result = await actualizarPesoIntento(deportista_id, partidaId, peso, tipo);
    
    if (!result) {
      throw new Error('Registro o intento no encontrado');
    }
    
    res.status(200).json({
      message: 'Intento actualizado exitosamente',
      athlete: result,
    });
  } catch (error) {
    console.error('Error al actualizar el intento:', error);
    
    if (error === 'Registro o intento no encontrado') {
      res.status(404).json({ message: error });
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};
export const obtenerRegistrosPorPartidaId= async (req: Request, res: Response): Promise<void> => {
  try {
    const { partidaId } = req.params;

    const registros = await obtenerPartida(partidaId);

    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al obtener los registros del deportista:', error);
    res.status(500).send('Error interno del servidor');
  }
};


export const eventAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { event, partidaId, platform }, body
    } = req;

    const request: RequestEventData = { event, partidaId, platform, body }

    await eventoService.actionEvento(request);
    res.status(200).json({ message: "Event iniciado" });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar el evento" });
  }
};


export const geteventsAction = (req: Request, res: Response): void => {
  const {
    params: { partidaId, platform },
  } = req;

  eventoService.addClient(partidaId, res, platform);
};



