"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTrackerPassword = exports.checkTrackerSlug = exports.updateTracker = exports.deleteTracker = exports.getTrackers = exports.createTracker = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTracker = async (req, res) => {
    try {
        const { name, team, password, slug } = req.body;
        // Basic validation
        if (!name || !slug) {
            return res.status(400).json({ error: 'Name and Slug are required' });
        }
        const existingTracker = await prisma.tracker.findUnique({
            where: { slug },
        });
        if (existingTracker) {
            return res.status(400).json({ error: 'Slug already taken' });
        }
        const tracker = await prisma.tracker.create({
            data: {
                name,
                team: team || 'USER',
                password,
                slug,
                targetUrl: `http://localhost:5173/${slug}` // Auto-generate target URL for now
            },
        });
        res.status(201).json(tracker);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create tracker' });
    }
};
exports.createTracker = createTracker;
const getTrackers = async (req, res) => {
    try {
        const trackers = await prisma.tracker.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(trackers);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch trackers' });
    }
};
exports.getTrackers = getTrackers;
const deleteTracker = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.tracker.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Tracker deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete tracker' });
    }
};
exports.deleteTracker = deleteTracker;
const updateTracker = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, team, password, slug } = req.body;
        const tracker = await prisma.tracker.update({
            where: { id: Number(id) },
            data: {
                name,
                team,
                password,
                // Only update slug/targetUrl if slug is provided
                ...(slug && {
                    slug,
                    targetUrl: `http://localhost:5173/${slug}`
                })
            }
        });
        res.json(tracker);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update tracker' });
    }
};
exports.updateTracker = updateTracker;
const checkTrackerSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const tracker = await prisma.tracker.findUnique({
            where: { slug }
        });
        if (!tracker) {
            return res.status(404).json({ error: 'Tracker not found' });
        }
        // Return only necessary info
        res.json({
            exists: true,
            hasPassword: !!tracker.password,
            trackerId: tracker.id // Might be needed for other calls
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to check tracker' });
    }
};
exports.checkTrackerSlug = checkTrackerSlug;
const verifyTrackerPassword = async (req, res) => {
    try {
        const { slug, password } = req.body;
        const tracker = await prisma.tracker.findUnique({
            where: { slug }
        });
        if (!tracker) {
            return res.status(404).json({ error: 'Tracker not found' });
        }
        if (tracker.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.json({ success: true, tracker });
    }
    catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
};
exports.verifyTrackerPassword = verifyTrackerPassword;
