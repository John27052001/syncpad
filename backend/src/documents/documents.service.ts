import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create() {
    return this.prisma.document.create({
      data: {
        title: 'Untitled',
        content: '',
      },
    });
  }  

  async findAll() {
    return this.prisma.document.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: string, dto: UpdateDocumentDto) {
    const existing = await this.findOne(id);
    const newContent = dto.content !== undefined ? dto.content : existing.content;
    const newTitle = dto.title !== undefined ? dto.title : existing.title;

    const doc = await this.prisma.document.update({
      where: { id },
      data: { title: newTitle, content: newContent },
    });

    if (dto.content !== undefined) {
      const nextVersion = (existing.versions[0]?.version ?? 0) + 1;
      await this.createVersion(id, newContent, nextVersion);
    }

    return doc;
  }

  async createVersion(documentId: string, content: string, version: number) {
    return this.prisma.version.create({
      data: { documentId, content, version },
    });
  }

  async getVersions(documentId: string) {
    return this.prisma.version.findMany({
      where: { documentId },
      orderBy: { version: 'desc' },
    });
  }

  async delete(id: string) {
    await this.prisma.document.delete({ where: { id } });
    return { deleted: true };
  }
}
