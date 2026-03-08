import { PrismaService } from '../prisma/prisma.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
export declare class DocumentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(): Promise<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        versions: {
            version: number;
            id: string;
            content: string;
            createdAt: Date;
            documentId: string;
        }[];
    } & {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateDocumentDto): Promise<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createVersion(documentId: string, content: string, version: number): Promise<{
        version: number;
        id: string;
        content: string;
        createdAt: Date;
        documentId: string;
    }>;
    getVersions(documentId: string): Promise<{
        version: number;
        id: string;
        content: string;
        createdAt: Date;
        documentId: string;
    }[]>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
