import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMarkdownDto } from './dto/createMarkdown.dto';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { UpdateMarkdownDto } from './dto/updateMarkdown.dto';

@Injectable()
export class MarkdownService {
  constructor(private prisma: PrismaService) {}

  async getMarkdowns() {
    try {
      const markdowns = await this.prisma.markdown.findMany();
      const markdownsWithContent = await Promise.all(
        markdowns.map(async (markdown) => {
          try {
            const content = await fs.readFile(markdown.path, 'utf-8');
            return { ...markdown, content };
          } catch (error) {
            throw error;
          }
        }),
      );
      return markdownsWithContent;
    } catch (error) {
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async createMarkdown(createMarkdownDto: CreateMarkdownDto) {
    try {
      const fileName = `${createMarkdownDto.title}.txt`;
      const filePath = join(process.cwd(), 'files', fileName);

      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        throw new Error(
          `Markdown with title ${createMarkdownDto.title} already exists`,
        );
      }
      await fs.writeFile(filePath, createMarkdownDto.content);

      const markdown = await this.prisma.markdown.create({
        data: {
          title: createMarkdownDto.title,
          path: filePath,
        },
      });
      return markdown;
    } catch (error) {
      throw error;
    }
  }

  async updateMarkdown(id: string, updateMarkdownDto: UpdateMarkdownDto) {
    try {
      const markdown = await this.prisma.markdown.findFirst({
        where: {
          id: id,
        },
      });

      if (!markdown) {
        throw new Error(`Markdown with id ${id} not found`);
      }

      if (updateMarkdownDto.title) {
        await this.prisma.markdown.update({
          where: { id: markdown.id },
          data: { title: updateMarkdownDto.title },
        });

        const oldFilePath = markdown.path;
        const newFileName = `${updateMarkdownDto.title}.txt`;

        const oldDirectory = dirname(oldFilePath);

        const newFilePath = join(oldDirectory, newFileName);

        await fs.rename(oldFilePath, newFilePath);

        await this.prisma.markdown.update({
          where: { id: markdown.id },
          data: { path: newFilePath },
        });
      }

      if (updateMarkdownDto.content) {
        await fs.writeFile(markdown.path, updateMarkdownDto.content);
      }

      return markdown;
    } catch (error) {
      throw error;
    }
  }

  async deleteMarkdown(id: string) {
    try {
      const markdown = await this.prisma.markdown.findUnique({
        where: {
          id: id,
        },
        select: {
          path: true,
        },
      });

      if (!markdown) {
        throw new Error(`Markdown with id ${id} not found`);
      }

      await fs.unlink(markdown.path);

      await this.prisma.markdown.delete({
        where: {
          id: id,
        },
      });

      return;
    } catch (error) {
      throw error;
    }
  }

  async deleteAllMarkdowns() {
    try {
      await this.prisma.markdown.findMany();
    } catch (error) {
      throw error;
    }
  }

  async getMarkdownById(id: string) {
    try {
      const markdown = await this.prisma.markdown.findUnique({
        where: {
          id: id,
        },
      });
      return markdown;
    } catch (error) {
      throw error;
    }
  }
}
