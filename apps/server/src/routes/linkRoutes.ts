import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/links - Create a new short link
router.post('/', async (req, res) => {
    try {
        const { slug, targetUrl, domain, trackerId, network, ogImage, ogTitle, ogDescription } = req.body;

        const link = await prisma.link.create({
            data: {
                slug,
                targetUrl,
                domain,
                trackerId,
                network,
                ogImage,
                ogTitle,
                ogDescription
            }
        });

        res.json({ success: true, link });
    } catch (error) {
        console.error('Error creating link:', error);
        res.status(500).json({ error: 'Failed to create link' });
    }
});

export default router;

