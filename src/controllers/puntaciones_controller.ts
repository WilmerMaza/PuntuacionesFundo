import { Request, Response } from 'express';
import * as registroService from '../service/Service_puntaciones';
import mongoose from 'mongoose';
import { Intento } from '../models/models_puntaciones';
import { RequestEventData } from "../models/RequestEventData";
import  {evento_service }from "../service/evento_service";

// Function to create a new record
export const crearRegistro = async (req: Request, res: Response) => {
  try {
    const resultado = await registroService.crearRegistro(req.body);
    res.status(201).send(resultado);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Function to update attempts in an existing record
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

// Function to get records by athlete ID
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

// Function to handle cronometro event
export const eventCronometro = async (req: Request, res: Response) => {
  try {
    const {
      params: { event, partidaId, platform }, body
    } = req;

    const request: RequestEventData = { event, partidaId, platform, body }

    evento_service.actionCronometro(request);
    res.status(200).json({ message: "Event iniciado" });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar el evento" });
  }
};

// Function to get cronometro events
export const getCronometroEvents = (req: Request, res: Response) => {
  const {
    params: { partidaId, platform },
  } = req;

  evento_service.addClient(partidaId, res, platform);
};
