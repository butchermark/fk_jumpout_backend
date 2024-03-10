import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarkdownModule } from './markdown/markdown.module';

@Module({
  imports: [MarkdownModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
