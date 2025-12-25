import { Router } from 'express';
import { createTracker, getTrackers, deleteTracker, updateTracker, checkTrackerSlug, verifyTrackerPassword } from '../controllers/trackerController';

const router = Router();

router.post('/', createTracker);
router.get('/', getTrackers);
router.delete('/:id', deleteTracker);
router.put('/:id', updateTracker);

// Password protection routes
router.get('/slug/:slug', checkTrackerSlug);
router.post('/verify-password', verifyTrackerPassword);

export default router;
