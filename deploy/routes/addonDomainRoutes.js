"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// GET all addon domains
router.get('/', async (req, res) => {
    try {
        const domains = await prisma.domain.findMany({
            include: {
                trackers: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { addedAt: 'desc' }
        });
        // Transform data to match frontend expectations
        const transformed = domains.map((d, index) => ({
            id: `#EMP-${3000 + d.id}`,
            dbId: d.id,
            title: d.name,
            status: d.status,
            ssl: d.ssl,
            group: d.trackers.length > 0 ? d.trackers[0].name : 'Global Domain',
            trackerId: d.trackers.length > 0 ? d.trackers[0].id : null,
            iconColor: ['blue', 'purple', 'orange', 'teal', 'slate'][index % 5]
        }));
        res.json(transformed);
    }
    catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
});
// POST create new addon domain
router.post('/', async (req, res) => {
    try {
        const { domain, group, trackerId } = req.body;
        if (!domain) {
            return res.status(400).json({ error: 'Domain name is required' });
        }
        // Check if domain already exists
        const existing = await prisma.domain.findFirst({
            where: { name: domain }
        });
        if (existing) {
            return res.status(400).json({ error: 'Domain already exists' });
        }
        // Create the domain
        const newDomain = await prisma.domain.create({
            data: {
                name: domain,
                status: 'Active',
                ssl: 'Pending'
            }
        });
        // If trackerId provided (not global), connect to tracker
        if (trackerId && trackerId !== 'global') {
            await prisma.tracker.update({
                where: { id: parseInt(trackerId) },
                data: { domainId: newDomain.id }
            });
        }
        res.status(201).json({
            success: true,
            domain: newDomain
        });
    }
    catch (error) {
        console.error('Error creating domain:', error);
        res.status(500).json({ error: 'Failed to create domain' });
    }
});
// DELETE addon domain
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // First disconnect any trackers
        await prisma.tracker.updateMany({
            where: { domainId: parseInt(id) },
            data: { domainId: null }
        });
        // Then delete the domain
        await prisma.domain.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting domain:', error);
        res.status(500).json({ error: 'Failed to delete domain' });
    }
});
// PUT update addon domain status
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ssl, trackerId } = req.body;
        const updateData = {};
        if (status)
            updateData.status = status;
        if (ssl)
            updateData.ssl = ssl;
        const updated = await prisma.domain.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        // Update tracker association if provided
        if (trackerId !== undefined) {
            // First remove old associations
            await prisma.tracker.updateMany({
                where: { domainId: parseInt(id) },
                data: { domainId: null }
            });
            // Then add new association if not global
            if (trackerId && trackerId !== 'global') {
                await prisma.tracker.update({
                    where: { id: parseInt(trackerId) },
                    data: { domainId: parseInt(id) }
                });
            }
        }
        res.json({ success: true, domain: updated });
    }
    catch (error) {
        console.error('Error updating domain:', error);
        res.status(500).json({ error: 'Failed to update domain' });
    }
});
exports.default = router;
