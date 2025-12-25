import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/postback - Handle S2S Postback from Network
// Example: /api/postback?click_id=xxxx&payout=2.50
router.get('/', async (req, res) => {
    try {
        const { click_id, payout } = req.query;

        if (!click_id) {
            return res.status(400).send('Missing click_id');
        }

        // Extract SLUG from click_id (last 9 characters based on generateClickId logic)
        const slug = (click_id as string).slice(-9);

        const link = await prisma.link.findUnique({
            where: { slug }
        });

        if (!link) {
            // Try 8 chars as fallback
            const slug8 = (click_id as string).slice(-8);
            const link8 = await prisma.link.findUnique({
                where: { slug: slug8 }
            });

            if (!link8) {
                console.log(`[POSTBACK] Link not found for click_id: ${click_id}`);
                return res.status(404).send('Link not found');
            }

            // Found with 8 chars
            const amount = parseFloat(payout as string) || 0;
            await prisma.conversion.create({
                data: {
                    linkId: link8.id,
                    clickId: click_id as string,
                    payout: amount
                }
            });
            console.log(`[POSTBACK] Conversion recorded! Slug: ${slug8}, Amount: $${amount}`);
            return res.status(200).send('OK');
        }

        const amount = parseFloat(payout as string) || 0;

        await prisma.conversion.create({
            data: {
                linkId: link.id,
                clickId: click_id as string,
                payout: amount
            }
        });

        console.log(`[POSTBACK] Conversion recorded! Slug: ${slug}, Amount: $${amount}`);
        res.status(200).send('OK');

    } catch (error) {
        console.error('Postback Error:', error);
        res.status(500).send('Error');
    }
});

export default router;
