"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trackerController_1 = require("../controllers/trackerController");
const router = (0, express_1.Router)();
router.post('/', trackerController_1.createTracker);
router.get('/', trackerController_1.getTrackers);
router.delete('/:id', trackerController_1.deleteTracker);
router.put('/:id', trackerController_1.updateTracker);
// Password protection routes
router.get('/slug/:slug', trackerController_1.checkTrackerSlug);
router.post('/verify-password', trackerController_1.verifyTrackerPassword);
exports.default = router;
