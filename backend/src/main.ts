import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
app.enableCors({
  origin: [
    'https://syncpad-7p3ff8u98-meghajohnbabu-6318s-projects.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
});
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`SyncPad backend running on http://localhost:${port}`);
}
bootstrap();
