import { Request, Response } from 'express';
import * as registroService from '../service/Service_puntaciones';
import mongoose from 'mongoose';
import { Intento } from '../models/models_puntaciones';
import { RequestEventData } from "../models/RequestEventData";
import { eventoService } from "../service/evento_service";
import { crearRegistro } from '../service/Service_puntaciones';

export const crearRegistroController = async (req: Request, res: Response): Promise<void> => {
  try {
    const resultado = await crearRegistro(req.body);
    res.status(201).send(resultado);
  } catch (error) {
    console.error('Error al crear el registro:', error);
    res.status(400).send({ error });
  }
};

export const actualizarIntentos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send('ID de registro inválido');
      return;
    }

    const intento: Intento = req.body;

    const result = await registroService.agregarIntento(id, intento);
    if (!result) {
      res.status(404).send('Registro no encontrado');
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al actualizar los intentos:', error);
    res.status(500).send('Error interno del servidor');
  }
};


export const obtenerRegistrosPorDeportistaId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deportistaId } = req.params;

    const registros = await registroService.obtenerRegistrosPorDeportistaId(deportistaId);

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
