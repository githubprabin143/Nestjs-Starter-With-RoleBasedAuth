import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    bodyParser: true,
    logger:true
  });
  app.enableCors()
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({transform:true}))
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT',8000)
  
  //Swagger Integration
  const options = new DocumentBuilder()
    .setTitle('Nest Test')
    .setDescription('The Nest Test API description')
    .setVersion('1.0')
    .addTag('NestTest')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger-api', app, document);

  await app.listen(PORT)
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch(err=>console.log(err));
