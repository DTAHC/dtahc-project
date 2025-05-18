import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper pour nettoyer la base de données pendant les tests
  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Cette méthode ne peut être appelée que dans l\'environnement de test !');
      return;
    }

    const models = Reflect.ownKeys(this).filter(
      (key: string | symbol) => {
        const keyStr = key.toString();
        return keyStr[0] !== '_' && keyStr[0] !== '$' && typeof this[key as keyof this] === 'object';
      },
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof this] as any;
        return model.deleteMany();
      }),
    );
  }
}