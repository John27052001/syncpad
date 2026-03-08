"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DocumentsService = class DocumentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
        const doc = await this.prisma.document.findUnique({
            where: { id },
            include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        return doc;
    }
    async update(id, dto) {
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
    async createVersion(documentId, content, version) {
        return this.prisma.version.create({
            data: { documentId, content, version },
        });
    }
    async getVersions(documentId) {
        return this.prisma.version.findMany({
            where: { documentId },
            orderBy: { version: 'desc' },
        });
    }
    async delete(id) {
        await this.prisma.document.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map