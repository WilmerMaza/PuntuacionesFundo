import mongoose, { Schema, Document } from 'mongoose';

// Definir una interfaz para el documento de usuario
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Definir el esquema de usuario
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Crear el modelo de usuario
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
