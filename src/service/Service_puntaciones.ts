
import { Registro, RegistroDocument, Intento } from '../models/models_puntaciones';

export const crearRegistro = async (data: Partial<RegistroDocument>): Promise<RegistroDocument> => {
  const nuevoRegistro = new Registro(data);
  return await nuevoRegistro.save();
};
export const agregarIntento = async (registroId: string, intentoData: Intento): Promise<RegistroDocument | null> => {
  try {
    const registroToUpdate = await Registro.findByIdAndUpdate(
      registroId,
      { $push: { intentos: intentoData } },
      { new: true } 
    );

    return registroToUpdate;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const obtenerRegistrosPorDeportistaId = async (deportistaId: string): Promise<RegistroDocument[]> => {
  try {
    const registros = await Registro.find({ deportista_id: deportistaId });
    return registros;
  } catch (error) {
    console.error('Error al obtener los registros del deportista:', error);
    return [];
  }
};