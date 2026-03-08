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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const documents_service_1 = require("./documents.service");
let DocumentsGateway = class DocumentsGateway {
    constructor(documentsService) {
        this.documentsService = documentsService;
        this.roomClients = new Map();
    }
    handleConnection(client) {
        console.log('Client connected:', client.id);
    }
    handleDisconnect(client) {
        console.log('Client disconnected:', client.id);
        this.roomClients.forEach((clients, room) => {
            clients.delete(client.id);
            if (clients.size === 0)
                this.roomClients.delete(room);
        });
    }
    handleJoinDocument(client, documentId) {
        client.join(documentId);
        if (!this.roomClients.has(documentId)) {
            this.roomClients.set(documentId, new Set());
        }
        this.roomClients.get(documentId).add(client.id);
        console.log(`Client ${client.id} joined ${documentId}`);
    }
    handleLeaveDocument(client, documentId) {
        client.leave(documentId);
        this.roomClients.get(documentId)?.delete(client.id);
    }
    async handleEdit(client, payload) {
        const { documentId, content, title } = payload;
        if (!documentId || content === undefined)
            return;
        client.join(documentId);
        try {
            await this.documentsService.update(documentId, { content, title });
            this.server.to(documentId).emit('document-updated', {
                documentId,
                content,
                title,
                from: client.id,
            });
        }
        catch (err) {
            console.error(err);
            client.emit('error', { message: 'Failed to persist edit' });
        }
    }
    broadcastToDocument(documentId, event, data) {
        this.server.to(documentId).emit(event, data);
    }
};
exports.DocumentsGateway = DocumentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DocumentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-document'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], DocumentsGateway.prototype, "handleJoinDocument", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-document'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], DocumentsGateway.prototype, "handleLeaveDocument", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('edit'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], DocumentsGateway.prototype, "handleEdit", null);
exports.DocumentsGateway = DocumentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsGateway);
//# sourceMappingURL=documents.gateway.js.map