import { PrismaClient } from '@prisma/client';
declare global {
    var __db__: PrismaClient | undefined;
}
declare let prisma: PrismaClient;
export { prisma };
//# sourceMappingURL=database.d.ts.map