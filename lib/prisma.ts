import { PrismaClient } from '@prisma/client';

class PrismaSingleton {
  static client: PrismaSingleton;

  prisma: PrismaClient;

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.prisma = new PrismaClient({ log: ['info', 'warn'] });
    } else {
      if (!global || !(global as any).prisma) {
        (global as any).prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
      }
      this.prisma = (global as any).prisma;
    }
  }

  static getInstance = () => {
    if (!PrismaSingleton.client) {
      PrismaSingleton.client = new PrismaSingleton();
    }
    return PrismaSingleton.client;
  };

  static getPrismaInstance = () => {
    if (!PrismaSingleton.client) {
      PrismaSingleton.client = new PrismaSingleton();
    }
    return PrismaSingleton.client.prisma;
  };
}

export default PrismaSingleton.getPrismaInstance();