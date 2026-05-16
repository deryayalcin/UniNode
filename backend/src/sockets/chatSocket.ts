import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

interface AuthSocket extends Socket {
  userId?: string;
}

export const initChatSocket = (io: Server): void => {
  // JWT authentication for socket connections
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET!) as { id: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, isVerified: true },
      });

      if (!user || !user.isVerified) {
        return next(new Error('User not verified'));
      }

      socket.userId = user.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join a conversation room
    socket.on('join_conversation', async ({ conversationId }: { conversationId: string }) => {
      try {
        // Verify user is participant
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId: socket.userId!,
            },
          },
        });

        if (!participant) {
          socket.emit('error', { message: 'Not a participant of this conversation' });
          return;
        }

        socket.join(conversationId);
        console.log(`User ${socket.userId} joined conversation ${conversationId}`);
      } catch (error) {
        console.error('Join conversation error:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Send a message
    socket.on(
      'send_message',
      async ({ conversationId, content }: { conversationId: string; content: string }) => {
        try {
          if (!content?.trim()) {
            socket.emit('error', { message: 'Message content is required' });
            return;
          }

          // Verify user is participant
          const participant = await prisma.conversationParticipant.findUnique({
            where: {
              conversationId_userId: {
                conversationId,
                userId: socket.userId!,
              },
            },
          });

          if (!participant) {
            socket.emit('error', { message: 'Not a participant of this conversation' });
            return;
          }

          // Save message to database
          const message = await prisma.message.create({
            data: {
              content: content.trim(),
              conversationId,
              senderId: socket.userId!,
            },
            include: {
              sender: {
                select: { id: true, name: true, avatarUrl: true },
              },
            },
          });

          // Broadcast to all in the conversation room
          io.to(conversationId).emit('new_message', {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            sender: message.sender,
            createdAt: message.createdAt,
            conversationId: message.conversationId,
          });
        } catch (error) {
          console.error('Send message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      }
    );

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
