"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL não foi encontrada.");
}
const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const prisma = new client_1.PrismaClient({
    adapter
});
exports.default = prisma;
