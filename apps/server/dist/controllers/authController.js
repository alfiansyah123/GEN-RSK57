"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.setupInitialAdmin = exports.changePassword = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';
const login = async (req, res) => {
    try {
        const { password } = req.body;
        // Find the admin user (we assume single user for now or find by username if we kept it)
        // Since we removed username field in frontend, we might just look for *any* admin or a specific one?
        // Let's stick to the schema I just made: Admin has username & password. 
        // But frontend only sends password. 
        // We will default to username 'admin' for the lookup.
        console.log('Login attempt received with password length:', password?.length);
        const admin = await prisma.admin.findUnique({
            where: { username: 'admin' }
        });
        if (!admin) {
            console.log('Admin user not found in database');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log('Admin found, checking password...');
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        console.log('Password match result:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate Token
        const token = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
            expiresIn: '24h'
        });
        res.json({ token, user: { username: admin.username } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Both old and new passwords are required' });
        }
        const admin = await prisma.admin.findUnique({
            where: { username: 'admin' }
        });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        const isMatch = await bcryptjs_1.default.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid old password' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma.admin.update({
            where: { username: 'admin' },
            data: { password: hashedPassword }
        });
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
};
exports.changePassword = changePassword;
const setupInitialAdmin = async (req, res) => {
    try {
        const count = await prisma.admin.count();
        if (count > 0) {
            return res.status(403).json({ error: 'Admin already exists' });
        }
        const { password } = req.body;
        if (!password)
            return res.status(400).json({ error: 'Password required' });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await prisma.admin.create({
            data: {
                username: 'admin',
                password: hashedPassword
            }
        });
        res.json({ message: 'Admin created successfully', username: admin.username });
    }
    catch (error) {
        res.status(500).json({ error: 'Setup failed' });
    }
};
exports.setupInitialAdmin = setupInitialAdmin;
const verifyToken = async (req, res) => {
    // Simple check endpoint to validate token on frontend reload
    // Middleware would handle the actual verification before reaching here
    res.json({ valid: true });
};
exports.verifyToken = verifyToken;
