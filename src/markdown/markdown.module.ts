import { Module } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarkdownService } from './markdown.service';

@Module({
  controllers: [MarkdownController],
  providers: [MarkdownService, PrismaService],
})
export class MarkdownModule {}
