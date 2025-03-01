import { Intento, Registro, RegistroDocument } from '../models/models_puntaciones';
import { RequestEventData } from '../models/RequestEventData';
import { eventoService } from './evento_service';


export const crearRegistro = async (data: any): Promise<RegistroDocument> => {
  const { deportista_id, Id_Partida, tipo, intento } = data;

  const dataFin = await Registro.findOne({ deportista_id, Id_Partida, tipo }).sort({ fecha: -1 });
  if (dataFin) {
    let registroEvaluar: any = dataFin.intentos.find(({ resultado }: Intento) => resultado === 'Evaluar');
    let responseUpdate = await Registro.updateOne(
      { _id: dataFin.id, 'intentos._id': registroEvaluar.id },
      { $set: { 'intentos.$.resultado': intento.resultado } }
    );
    if (!responseUpdate.acknowledged) {
      console.log('====================================');
      console.log('Error: La actualización del intento no fue reconocida');
      console.log('====================================');
    }
    if (dataFin.intentos.length < 3) {
      const ultimoIntento: Intento = {
        numero: 3,
        peso: intento.resultado === 'Éxito' ? registroEvaluar.peso + 1 : registroEvaluar.peso,
        resultado: 'Evaluar',
        tiempo: new Date()
      };
      responseUpdate = await Registro.updateOne(
        { deportista_id, Id_Partida, tipo },
        { $push: { intentos: ultimoIntento } }
      );
    }
  } else {
    const intentos = [];
    for (let index = 0; index < 2; index++) {
      intentos.push({
        numero: index + 1,
        peso: intento.resultado === 'Éxito' && index > 0 ? intento.peso + 1 : intento.peso,
        resultado: index === 1 ? 'Evaluar' : intento.resultado,
        tiempo: new Date()
      })

    }

    const nuevoRegistro = new Registro({
      deportista_id,
      fecha: new Date(),
      tipo,
      intentos,
      Id_Partida
    });
    await nuevoRegistro.save();
  }
  const requestEvento: RequestEventData = {
    event: 'create',
    partidaId: Id_Partida,
    platform: 'movil',
    body: data
  };

  eventoService.actionEvento(requestEvento);

  return data;
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


export const actualizarPesoIntento = async (deportista_id: string, Id_Partida: string, nuevoPeso: number, tipo: string): Promise<RegistroDocument | null> => {
  try {
    let dataFin = await Registro.findOne({ deportista_id, Id_Partida , tipo }).sort({ fecha: -1 });

    if (!dataFin) {
    
      dataFin = new Registro({
        deportista_id,
        Id_Partida,
        tipo: tipo, 
        intentos: [
          {
            numero: 1,
            peso: nuevoPeso,
            resultado: 'Evaluar',
            tiempo: new Date() 
          }
        ],
        fecha: new Date()
      });
    } else {
      const registroEvaluar = dataFin.intentos.find((intento: Intento) => intento.resultado === 'Evaluar');

      if (registroEvaluar) {
        registroEvaluar.peso = nuevoPeso;
        registroEvaluar.tiempo = new Date(); 
      }
    }

    await dataFin.save(); 
    return dataFin;
  } catch (error) {
    console.error('Error al actualizar el peso del intento:', error);
    return null; 
  }
};

export const obtenerRegistrosPorPartidaId = async (partidaId: string): Promise<RegistroDocument[]> => {
  try {
    const registros = await Registro.find({ Id_Partida: partidaId }).exec();
    return registros;
  } catch (error) {
    console.error('Error al obtener los registros por partidaId:', error);
    throw new Error('Error al obtener los registros');
  }
};