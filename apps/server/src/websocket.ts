import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

// Store connected clients
const clients: Set<WebSocket> = new Set();

// Live traffic data interface
export interface LiveTrafficData {
    trackerId: string;
    country: string;
    ip: string;
    platform: string;
    network: string;
    timestamp: string;
}

let wss: WebSocketServer;

// Initialize WebSocket server
export function initWebSocket(server: Server) {
    wss = new WebSocketServer({ server, path: '/ws/live-traffic' });

    wss.on('connection', (ws: WebSocket) => {
        console.log('[WebSocket] Client connected');
        clients.add(ws);

        ws.on('close', () => {
            console.log('[WebSocket] Client disconnected');
            clients.delete(ws);
        });

        ws.on('error', (err) => {
            console.error('[WebSocket] Error:', err);
            clients.delete(ws);
        });

        // Send a welcome message
        ws.send(JSON.stringify({ type: 'connected', message: 'Live Traffic Feed Connected' }));
    });

    console.log('[WebSocket] Live Traffic server initialized on /ws/live-traffic');
}

// Broadcast new click to all connected clients
export function broadcastClick(data: LiveTrafficData) {
    const message = JSON.stringify({
        type: 'click',
        data
    });

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Get connected client count
export function getConnectedClients(): number {
    return clients.size;
}
