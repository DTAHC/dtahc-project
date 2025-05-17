import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { PrismaModule } from './modules/common/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Base de données
    PrismaModule,
    
    // Modules applicatifs
    AuthModule,
    UsersModule,
    ClientsModule,
    WorkflowModule,
    DocumentsModule,
    AccountingModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}