import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { ClientsController } from './controllers/clients.controller';
import { DossiersController } from './controllers/dossiers.controller';
import { ClientsService } from './services/clients.service';
import { DossiersService } from './services/dossiers.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientsController, DossiersController],
  providers: [ClientsService, DossiersService],
  exports: [ClientsService, DossiersService],
})
export class ClientsModule {}