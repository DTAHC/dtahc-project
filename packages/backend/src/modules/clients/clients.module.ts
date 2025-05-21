import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { EmailsModule } from '../emails/emails.module';
import { ClientsController } from './controllers/clients.controller';
import { DossiersController } from './controllers/dossiers.controller';
import { FormLinksController } from './controllers/form-links.controller';
import { ClientsService } from './services/clients.service';
import { DossiersService } from './services/dossiers.service';
import { FormLinksService } from './services/form-links.service';

@Module({
  imports: [
    PrismaModule,
    EmailsModule
  ],
  controllers: [
    ClientsController, 
    DossiersController,
    FormLinksController
  ],
  providers: [
    ClientsService, 
    DossiersService,
    FormLinksService
  ],
  exports: [
    ClientsService, 
    DossiersService,
    FormLinksService
  ],
})
export class ClientsModule {}