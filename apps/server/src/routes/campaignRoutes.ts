import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all campaigns
router.get('/', async (req: Request, res: Response) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// Get single campaign by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const campaign = await prisma.campaign.findUnique({
            where: { id: parseInt(id) }
        });
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        console.error('Error fetching campaign:', error);
        res.status(500).json({ error: 'Failed to fetch campaign' });
    }
});

// Create new campaign
router.post('/', async (req: Request, res: Response) => {
    try {
        const { network, urlTemplate, postbackEndpoint, offerName } = req.body;

        if (!network || !urlTemplate || !postbackEndpoint || !offerName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const campaign = await prisma.campaign.create({
            data: {
                network,
                urlTemplate,
                postbackEndpoint,
                offerName
            }
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// Update campaign
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { network, urlTemplate, postbackEndpoint, offerName } = req.body;

        const campaign = await prisma.campaign.update({
            where: { id: parseInt(id) },
            data: {
                network,
                urlTemplate,
                postbackEndpoint,
                offerName
            }
        });

        res.json(campaign);
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ error: 'Failed to update campaign' });
    }
});

// Delete campaign
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.campaign.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
});

export default router;
