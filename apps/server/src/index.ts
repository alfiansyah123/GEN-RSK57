console.log('Starting server...');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import { initWebSocket } from './websocket';

dotenv.config();

import trackerRoutes from './routes/trackerRoutes';
import campaignRoutes from './routes/campaignRoutes';
import linkRoutes from './routes/linkRoutes';
import redirectRoutes from './routes/redirectRoutes';
import postbackRoutes from './routes/postbackRoutes';
import reportRoutes from './routes/reportRoutes';
import addonDomainRoutes from './routes/addonDomainRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/trackers', trackerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/postback', postbackRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/addon-domains', addonDomainRoutes);
app.use('/api/upload', uploadRoutes);

// Register redirect routes LAST as it handles catch-all /:slug
app.use('/', redirectRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Initialize WebSocket for live traffic
initWebSocket(server);

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`WebSocket available at ws://localhost:${port}/ws/live-traffic`);
});
