import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { IMarkdown } from './interface/IMarkdown.interface';
import { UpdateMarkdownDto } from './dto/updateMarkdown.dto';

@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Get()
  getMarkdowns(): Promise<IMarkdown[]> {
    return this.markdownService.getMarkdowns();
  }

  @Post()
  createMarkdown(@Body() markdown: IMarkdown): Promise<IMarkdown | string> {
    return this.markdownService.createMarkdown(markdown);
  }

  @Put('/:id')
  updateMarkdown(
    @Param('id') id: string,
    @Body() markdown: UpdateMarkdownDto,
  ): Promise<IMarkdown> {
    return this.markdownService.updateMarkdown(id, markdown);
  }

  @Delete('/:id')
  deleteMarkdown(@Param('id') id: string): Promise<void> {
    return this.markdownService.deleteMarkdown(id);
  }

  @Delete()
  deleteAllMarkdowns(): Promise<void> {
    return this.markdownService.deleteAllMarkdowns();
  }

  @Get('/:id')
  getMarkdownById(@Param('id') id: string): Promise<IMarkdown> {
    return this.markdownService.getMarkdownById(id);
  }
}
