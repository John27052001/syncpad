import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DocumentsService } from './documents.service';

export interface EditPayload {
  documentId: string;
  content: string;
  title?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DocumentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private roomClients: Map<string, Set<string>> = new Map();

  constructor(private readonly documentsService: DocumentsService) {}

  // Correct NestJS signature
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  // Correct NestJS signature
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    this.roomClients.forEach((clients, room) => {
      clients.delete(client.id);
      if (clients.size === 0) this.roomClients.delete(room);
    });
  }

  @SubscribeMessage('join-document')
  handleJoinDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() documentId: string,
  ) {
    client.join(documentId);

    if (!this.roomClients.has(documentId)) {
      this.roomClients.set(documentId, new Set());
    }

    this.roomClients.get(documentId)!.add(client.id);

    console.log(`Client ${client.id} joined ${documentId}`);
  }

  @SubscribeMessage('leave-document')
  handleLeaveDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() documentId: string,
  ) {
    client.leave(documentId);
    this.roomClients.get(documentId)?.delete(client.id);
  }

  @SubscribeMessage('edit')
  async handleEdit(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: EditPayload,
  ) {
    const { documentId, content, title } = payload;

    if (!documentId || content === undefined) return;

    // Ensure client is in the room
    client.join(documentId);

    try {
      await this.documentsService.update(documentId, { content, title });

      // Broadcast to everyone else
      this.server.to(documentId).emit('document-updated', {
        documentId,
        content,
        title,
        from: client.id,
      });
    } catch (err) {
      console.error(err);
      client.emit('error', { message: 'Failed to persist edit' });
    }
  }

  // Utility method
  broadcastToDocument(documentId: string, event: string, data: unknown) {
    this.server.to(documentId).emit(event, data);
  }
}
