import mongoose, { Document, Schema } from 'mongoose';

export interface Intento {
  numero: number;
  peso: mongoose.Types.Decimal128;
  resultado: 'Éxito' | 'Fallo';
}

export interface RegistroDocument extends Document {
  deportista_id: mongoose.Types.ObjectId;
  fecha: Date;
  tipo: 'Arranque' | 'Envión';
  intentos: Intento[];
}

const IntentoSchema = new Schema<Intento>({
  numero: { type: Number, required: true },
  peso: { type: Schema.Types.Decimal128, required: true },
  resultado: { type: String, enum: ['Éxito', 'Fallo'], required: true },
});

const RegistroSchema = new Schema<RegistroDocument>({
  deportista_id: { type: Schema.Types.ObjectId, required: true },
  fecha: { type: Date, required: true },
  tipo: { type: String, enum: ['Arranque', 'Envión'], required: true },
  intentos: { type: [IntentoSchema], required: true },
});

export const Registro = mongoose.model<RegistroDocument>('Registro', RegistroSchema);
