import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Contournement d'un DNS local qui ne résout pas les enregistrements SRV (URI mongodb+srv:// d'Atlas)
if (env.dnsServers.length > 0) dns.setServers(env.dnsServers);

mongoose.connection.on('disconnected', () => console.warn('MongoDB déconnecté'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnecté'));

export async function connectDB() {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connecté : ${mongoose.connection.name}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('MongoDB : connexion fermée');
}

export const isDbConnected = () => mongoose.connection.readyState === 1;
