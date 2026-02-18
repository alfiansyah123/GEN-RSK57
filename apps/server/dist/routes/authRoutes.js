"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
router.post('/change-password', authController_1.changePassword);
router.post('/setup', authController_1.setupInitialAdmin);
router.get('/verify', authController_1.verifyToken);
// Middleware to protect routes could be added here if needed
// e.g. router.use(authenticateToken);
exports.default = router;
