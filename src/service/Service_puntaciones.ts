import { Registro, RegistroDocument, Intento } from '../models/models_puntaciones';
import { eventoService } from './evento_service';
import { RequestEventData } from '../models/RequestEventData';


export const crearRegistro = async (data: RegistroDocument): Promise<RegistroDocument> => {
  const nuevoRegistro = new Registro(data);
  const resultado = await nuevoRegistro.save();
  const requestEvento: RequestEventData = {
    event: 'create',
    partidaId: data.Id_Partida,
    platform: 'movil',
    body: resultado
  }


  eventoService.actionEvento(requestEvento);

  return resultado;
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

export const obtenerRegistrosPorPartidaId = async (partidaId: string): Promise<RegistroDocument[]> => {
  try {
    // Suponiendo que `Registro` es tu modelo de Mongoose para los registros
    const registros = await Registro.find({ Id_Partida: partidaId }).exec();
    return registros;
  } catch (error) {
    console.error('Error al obtener los registros por partidaId:', error);
    throw new Error('Error al obtener los registros');
  }
};