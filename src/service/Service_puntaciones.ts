import { Registro, RegistroDocument, Intento } from '../models/models_puntaciones';


export const crearRegistro = async (data: any): Promise<RegistroDocument> => {
  const { deportista_id, Id_Partida, tipo, intento } = data;

  let registrosCreados: RegistroDocument[] = [];

  const dataFin = await Registro.findOne({ deportista_id, Id_Partida }).sort({ fecha: -1 });

  if (dataFin) {
    let registroEvaluar: any = dataFin.intentos.find(({ resultado }: Intento) => resultado === 'Evaluar');

    const registroUpdate: any = {
      ...registroEvaluar,
      peso: registroEvaluar.peso,
      numero: registroEvaluar.numero,
      id: registroEvaluar.id,
      resultado: intento.resultado
    }

    let responseUpdate = await Registro.updateOne(
      { _id: dataFin.id, 'intentos._id': registroUpdate.id },
      { $set: { 'intentos.$.resultado': intento.resultado } });


    if (!responseUpdate.acknowledged) {
      console.log('====================================');
      console.log('Error: La actualización del intento no fue reconocida');
      console.log('====================================');
    }

    if (dataFin.intentos.length < 3) {
      const ultimoIntento: Intento = {
        numero: 3,
        peso: intento.resultado === 'Éxito' ? registroEvaluar.peso + 1 : registroEvaluar.peso,
        resultado: 'Evaluar'
      };

      responseUpdate = await Registro.updateOne(
        { deportista_id, Id_Partida },
        { $push: { intentos: ultimoIntento } }
      );
    }

  } else {
    const intentos = []
    for (let index = 0; index < 2; index++) {
      intentos.push({
        numero: index + 1,
        peso: intento.resultado === 'Éxito' && index > 0 ? intento.peso + 1 : intento.peso,
        resultado: index === 1 ? 'Evaluar' : intento.resultado
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




  return registrosCreados[registrosCreados.length - 1];
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

export const actualizarPeso = async (deportista_id: string, numero: number, nuevo_peso: number): Promise<RegistroDocument | null> => {
  // Buscar el registro del deportista
  const registro = await Registro.findOne({ deportista_id });

  if (!registro) {
    throw new Error('Registro no encontrado');
  }

  const intento = registro.intentos.find(i => i.numero === numero);
  if (!intento) {
    throw new Error('Intento no encontrado');
  }


  intento.peso = nuevo_peso;

  await registro.save();
  
  return registro;
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