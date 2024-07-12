import { Request, Response } from 'express';
import { RegistroDocument } from '../models/models_puntaciones';
import { RequestEventData } from "../models/RequestEventData";
import { eventoService } from "../service/evento_service";
import { crearRegistro, actualizarPesoIntento } from '../service/Service_puntaciones';

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
    const { peso, partidaId } = req.body;




    const result = await actualizarPesoIntento(deportista_id, partidaId, peso);

    if (!result) {
      res.status(404).send('Registro o intento no encontrado');
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al actualizar el intento:', error);
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



