import { Registro, RegistroDocument, Intento } from '../models/models_puntaciones';
import { eventoService } from './evento_service';
import { RequestEventData } from '../models/RequestEventData';

export const crearRegistro = async (data: RegistroDocument): Promise<RegistroDocument> => {
  const { deportista_id, Id_Partida, tipo, intentos } = data;

  let registroExistente = await Registro.findOne({ deportista_id, Id_Partida });

  if (registroExistente) {
    if (registroExistente.intentos.length !== 2) {
      throw new Error('Debe haber dos intentos antes de agregar el tercero');
    }

    const ultimoIntento = registroExistente.intentos[1];

    if (!ultimoIntento || !ultimoIntento.resultado) {
      throw new Error('Los intentos previos no están definidos correctamente');
    }

    const pesoTercerIntento = ultimoIntento.resultado === 'Fallo' ? ultimoIntento.peso : intentos[1].peso;

    const nuevoIntento: Intento = {
      numero: 3,
      peso: pesoTercerIntento,
      resultado: intentos[0].resultado 
    };

    registroExistente.intentos.push(nuevoIntento);
    registroExistente.fecha = new Date();

    const resultado = await registroExistente.save();

    return resultado;
  } else {
    if (intentos.length !== 2) {
      throw new Error('Se deben proporcionar dos intentos en la primera creación');
    }

    const primerIntento: Intento = {
      numero: 1,
      peso: intentos[0].peso,
      resultado: intentos[0].resultado
    };

    if (!intentos[1] || !intentos[1].resultado) {
      throw new Error('El segundo intento no está definido correctamente');
    }

   
    if (primerIntento.resultado === 'Éxito' && intentos[1].peso <= primerIntento.peso) {
      throw new Error('El segundo intento debe ser al menos 1 kg mayor que el primer intento exitoso');
    }

   
    const pesoSegundoIntento = primerIntento.resultado === 'Fallo' ? primerIntento.peso : intentos[1].peso;

    const segundoIntento: Intento = {
      numero: 2,
      peso: pesoSegundoIntento,
      resultado: intentos[1].resultado
    };

    const nuevoRegistro = new Registro({
      deportista_id,
      fecha: new Date(),
      tipo,
      intentos: [primerIntento, segundoIntento],
      Id_Partida
    });

    const resultado = await nuevoRegistro.save();

    const requestEvento: RequestEventData = {
      event: 'create',
      partidaId: Id_Partida,
      platform: 'movil',
      body: resultado
    };

    eventoService.actionEvento(requestEvento);

    return resultado;
  }
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

    const registros = await Registro.find({ Id_Partida: partidaId }).exec();
    return registros;
  } catch (error) {
    console.error('Error al obtener los registros por partidaId:', error);
    throw new Error('Error al obtener los registros');
  }
};