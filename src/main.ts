import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationConfigService } from './modules/config/application-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get<ApplicationConfigService>(ApplicationConfigService);
  app.enableCors({
    origin: appConfigService.origin,
    credentials: true,
  });
  await app.listen(appConfigService.applicationPort);
}
bootstrap();
