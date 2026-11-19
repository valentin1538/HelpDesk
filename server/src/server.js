import 'dotenv/config';
import dns from 'node:dns';
import http from 'node:http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app.js';

if (process.env.DNS_SERVERS) dns.setServers(process.env.DNS_SERVERS.split(','));

await mongoose.connect(process.env.MONGO_URI);
console.log('MongoDB connecté :', mongoose.connection.name);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

server.listen(process.env.PORT, () => console.log(`API sur http://localhost:${process.env.PORT}`));