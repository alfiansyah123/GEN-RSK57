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
// Helper function to automatically register Custom Domain to Cloudflare Worker
async function registerCloudflareDomain(domainName) {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'fa3e9a63a2f812274447f3c67add0a2b';
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!apiToken) {
        console.log('[CF API] CLOUDFLARE_API_TOKEN missing. Skipping Cloudflare auto-register.');
        return null;
    }
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/services/redirect-worker/domains`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                environment: 'production',
                hostname: domainName,
                service: 'redirect-worker'
            })
        });
        const data = await response.json();
        console.log(`[CF API] Registered ${domainName} -> redirect-worker:`, data);
        return data;
    }
    catch (err) {
        console.error(`[CF API ERROR] Failed registering ${domainName}:`, err);
        return null;
    }
}
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
        // Auto-register domain to Cloudflare Worker via Cloudflare API
        await registerCloudflareDomain(domain);
        // Create the domain
        const newDomain = await prisma.domain.create({
            data: {
                name: domain,
                status: 'Active',
                ssl: 'Active'
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
