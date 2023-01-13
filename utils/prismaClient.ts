import { PrismaClient } from "@prisma/client";

const client = client || new PrismaClient();

export default client;
