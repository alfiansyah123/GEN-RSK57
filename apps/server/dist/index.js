"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Starting server...');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const client_1 = require("@prisma/client");
const websocket_1 = require("./websocket");
dotenv_1.default.config();
const trackerRoutes_1 = __importDefault(require("./routes/trackerRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const linkRoutes_1 = __importDefault(require("./routes/linkRoutes"));
const redirectRoutes_1 = __importDefault(require("./routes/redirectRoutes"));
const postbackRoutes_1 = __importDefault(require("./routes/postbackRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const addonDomainRoutes_1 = __importDefault(require("./routes/addonDomainRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins for easier debugging
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Serve static assets from public folder (Client Build)
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Serve Video Files (Alias for development/production)
app.use('/videos', express_1.default.static(path_1.default.join(__dirname, '../../client/public/videos')));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/trackers', trackerRoutes_1.default);
app.use('/api/campaigns', campaignRoutes_1.default);
app.use('/api/links', linkRoutes_1.default);
app.use('/api/postback', postbackRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/addon-domains', addonDomainRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
// Register redirect routes (Handles /:slug)
// If slug not found, it calls next()
app.use('/', redirectRoutes_1.default);
// SPA Fallback: Serve index.html for any other route
app.get('*', (req, res) => {
    // Check if we have a built frontend
    const indexHtml = path_1.default.join(__dirname, '../public/index.html');
    res.sendFile(indexHtml, (err) => {
        if (err) {
            res.status(404).send('Backend is running! Frontend not found. Please build the client and copy dist to server/public.');
        }
    });
});
// Initialize WebSocket for live traffic
(0, websocket_1.initWebSocket)(server);
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`WebSocket available at ws://localhost:${port}/ws/live-traffic`);
});
