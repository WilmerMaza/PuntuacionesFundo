
import { Request, Response } from 'express';
import * as registroService from '../service/Service_puntaciones';
import mongoose from 'mongoose';
import { Intento } from '../models/models_puntaciones';


export const crearRegistro = async (req: Request, res: Response) => {
  try {
    const resultado = await registroService.crearRegistro(req.body);
    res.status(201).send(resultado);

  } catch (error) {
    res.status(400).send(error);
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