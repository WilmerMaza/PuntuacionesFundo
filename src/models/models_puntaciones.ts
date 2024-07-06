import mongoose, { Document, Schema } from 'mongoose';

export interface Intento {
  numero: number;
  peso:number ;
  resultado: 'Éxito' | 'Fallo';
}

export interface RegistroDocument extends Document {
  deportista_id: string;
  fecha: Date;
  tipo: 'Arranque' | 'Envión';
  intentos: Intento[];
  Id_Partida: string 
}

const IntentoSchema = new Schema<Intento>({
  numero: { type: Number, required: true },
  peso: { type: Number, required: true },
  resultado: { type: String, enum: ['Éxito', 'Fallo'], required: true },
});

const RegistroSchema = new Schema<RegistroDocument>({
  deportista_id: { type:String, required: true },
  fecha: { type: Date, required: true },
  tipo: { type: String, enum: ['Arranque', 'Envión'], required: true },
  intentos: { type: [IntentoSchema], required: true },
  Id_Partida: { type: String, required: true }, // Añadido partidaId
});

export const Registro = mongoose.model<RegistroDocument>('Registro', RegistroSchema);
