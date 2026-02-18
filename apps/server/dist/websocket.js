"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocket = initWebSocket;
exports.broadcastClick = broadcastClick;
exports.getConnectedClients = getConnectedClients;
const ws_1 = require("ws");
// Store connected clients
const clients = new Set();
let wss;
// Initialize WebSocket server
function initWebSocket(server) {
    wss = new ws_1.WebSocketServer({ server, path: '/ws/live-traffic' });
    wss.on('connection', (ws) => {
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
function broadcastClick(data) {
    const message = JSON.stringify({
        type: 'click',
        data
    });
    clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(message);
        }
    });
}
// Get connected client count
function getConnectedClients() {
    return clients.size;
}
