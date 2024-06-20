
import { platform } from 'os';
import { Registro, RegistroDocument, Intento } from '../models/models_puntaciones';
import { eventoService } from './evento_service';
import { RequestEventData } from '../models/RequestEventData';


export const crearRegistro = async (data: RegistroDocument): Promise<RegistroDocument> => {
  const nuevoRegistro = new Registro(data);



  const resultado = await nuevoRegistro.save();

  const resquesmensjhe: RequestEventData = {
    event: 'create',
    partidaId: data.partidaId,
    platform: 'movil',
    body: resultado
  }
  

 eventoService.actionEvento(resquesmensjhe);

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
export const obtenerRegistrosPorDeportistaId = async (deportistaId: string): Promise<RegistroDocument[]> => {
  try {
    const registros = await Registro.find({ deportista_id: deportistaId });
    return registros;
  } catch (error) {
    console.error('Error al obtener los registros del deportista:', error);
    return [];
  }
};