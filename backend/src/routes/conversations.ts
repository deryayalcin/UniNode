import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// GET /conversations — get all conversations for current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: req.user!.id },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                university: true,
                isVerified: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// GET /conversations/:id/messages — get messages for a conversation
router.get(
  '/:id/messages',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { limit = '50', offset = '0' } = req.query;

      // Check if user is participant
      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId: req.params.id,
            userId: req.user!.id,
          },
        },
      });

      if (!participant) {
        res.status(403).json({ error: 'Not a participant of this conversation' });
        return;
      }

      const messages = await prisma.message.findMany({
        where: { conversationId: req.params.id },
        orderBy: { createdAt: 'asc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        include: {
          sender: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });

      res.json({ messages });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  }
);

export default router;
