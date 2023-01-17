import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const client =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

export default client;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
