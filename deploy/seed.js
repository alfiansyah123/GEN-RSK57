"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const password = process.argv[2];
    if (!password) {
        console.log('Please provide a password: npx ts-node src/seed.ts <password>');
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        const admin = await prisma.admin.upsert({
            where: { username: 'admin' },
            update: { password: hashedPassword },
            create: {
                username: 'admin',
                password: hashedPassword,
            },
        });
        console.log(`Admin user configured with password: ${password}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
