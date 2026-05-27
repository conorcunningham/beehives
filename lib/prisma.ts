import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

if (!process.env.DATABASE_URL){
 throw new Error ("DATABASE_URL is not set as an env var.")
}

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg ({ connectionString });
const prisma = new PrismaClient({ adapter })
export { prisma };
