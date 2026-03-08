import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DocumentsService } from './documents.service';
export interface EditPayload {
    documentId: string;
    content: string;
    title?: string;
}
export declare class DocumentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly documentsService;
    server: Server;
    private roomClients;
    constructor(documentsService: DocumentsService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinDocument(client: Socket, documentId: string): void;
    handleLeaveDocument(client: Socket, documentId: string): void;
    handleEdit(client: Socket, payload: EditPayload): Promise<void>;
    broadcastToDocument(documentId: string, event: string, data: unknown): void;
}
