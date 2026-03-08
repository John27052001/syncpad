import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [DocumentsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

