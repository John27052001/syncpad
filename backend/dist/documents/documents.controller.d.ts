import { DocumentsService } from './documents.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
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
    getVersions(id: string): Promise<{
        version: number;
        id: string;
        content: string;
        createdAt: Date;
        documentId: string;
    }[]>;
    update(id: string, dto: UpdateDocumentDto): Promise<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
