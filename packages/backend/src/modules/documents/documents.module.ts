import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

// Services
import { CadastreService } from './services/cadastre.service';
import { CadastreMapService } from './services/cadastre-map.service';
import { UrbanismeService } from './services/urbanisme.service';
import { ExternalSourcesService } from './services/external-sources.service';

// Controllers
import { CadastreController } from './controllers/cadastre.controller';
import { UrbanismeController } from './controllers/urbanisme.controller';
import { AdminSettingsController } from './controllers/admin-settings.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule
  ],
  controllers: [
    CadastreController,
    UrbanismeController,
    AdminSettingsController
  ],
  providers: [
    CadastreService,
    CadastreMapService,
    UrbanismeService,
    ExternalSourcesService
  ],
  exports: [
    CadastreService,
    CadastreMapService,
    UrbanismeService,
    ExternalSourcesService
  ]
})
export class DocumentsModule {}