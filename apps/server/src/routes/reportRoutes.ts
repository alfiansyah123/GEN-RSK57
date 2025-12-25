import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/reports - Get Aggregated Stats per Tracker (Smartlink)
// Called by clone-ngix frontend
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build date filter
        let dateFilter: any = {};
        if (startDate && endDate) {
            const start = new Date(startDate as string);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate as string);
            end.setHours(23, 59, 59, 999);
            dateFilter = {
                createdAt: {
                    gte: start,
                    lte: end
                }
            };
        }

        // Get all links with clicks and conversions filtered by date
        const links = await prisma.link.findMany({
            include: {
                clicks: {
                    where: dateFilter,
                    select: {
                        ip: true
                    }
                },
                conversions: {
                    where: dateFilter,
                    select: {
                        payout: true
                    }
                }
            }
        });

        // Aggregate by trackerId (smartlink)
        const reportMap = new Map<string, any>();

        for (const link of links) {
            const smartlink = link.trackerId;
            const network = link.network || 'iMonetizeIt';
            const key = `${smartlink}-${network}`;

            if (!reportMap.has(key)) {
                reportMap.set(key, {
                    smartlink,
                    network,
                    visits: 0,
                    uniqueIps: new Set<string>(),
                    clicks: 0,
                    leads: 0,
                    payouts: 0,
                });
            }

            const stats = reportMap.get(key);

            // Visits & Unique
            stats.visits += link.clicks.length;
            stats.clicks += link.clicks.length;
            link.clicks.forEach((c: { ip: string }) => stats.uniqueIps.add(c.ip));

            // Leads & Payout
            stats.leads += link.conversions.length;
            const linkRevenue = link.conversions.reduce((sum: number, conv: { payout: number }) => sum + conv.payout, 0);
            stats.payouts += linkRevenue;
        }

        // Format output - ONLY include entries with at least 1 click
        const reportData = Array.from(reportMap.values())
            .filter((stat) => stat.clicks > 0) // Filter out 0 clicks
            .map((stat) => ({
                smartlink: stat.smartlink,
                network: stat.network,
                visits: stat.visits,
                unique: stat.uniqueIps.size,
                clicks: stat.clicks,
                leads: stat.leads,
                payouts: stat.payouts.toFixed(2)
            }));

        // Return in format expected by clone-ngix frontend
        res.json({ data: reportData });

    } catch (error) {
        console.error('Report Error:', error);
        res.status(500).json({ data: [], error: 'Failed to fetch reports' });
    }
});

export default router;
