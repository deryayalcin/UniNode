import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware, verifiedOnly, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// GET /posts — list all active posts
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, limit = '20', offset = '0' } = req.query;

    const where: Record<string, unknown> = {
      isActive: true,
      eventDate: { gte: new Date() },
    };

    if (type && type !== 'tümü') {
      where.eventType = type as string;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { eventDate: 'asc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            university: true,
            isVerified: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    // Add spotsLeft to each post
    const postsWithSpots = await Promise.all(
      posts.map(async (post) => {
        const acceptedCount = await prisma.application.count({
          where: { postId: post.id, status: 'accepted' },
        });
        return {
          ...post,
          spotsLeft: post.spotsNeeded - acceptedCount,
        };
      })
    );

    res.json({ posts: postsWithSpots });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// GET /posts/:id — single post detail
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            university: true,
            isVerified: true,
            bio: true,
          },
        },
        applications: {
          where: { status: 'accepted' },
          select: { id: true },
        },
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if current user has already applied
    const userApplication = await prisma.application.findUnique({
      where: {
        postId_applicantId: {
          postId: post.id,
          applicantId: req.user!.id,
        },
      },
    });

    res.json({
      post: {
        ...post,
        spotsLeft: post.spotsNeeded - post.applications.length,
        userApplicationStatus: userApplication?.status || null,
      },
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// POST /posts — create a new post
router.post(
  '/',
  authMiddleware,
  verifiedOnly,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, eventType, eventDate, spotsNeeded } = req.body;

      if (!title || !eventType || !eventDate || !spotsNeeded) {
        res.status(400).json({ error: 'Title, eventType, eventDate and spotsNeeded are required' });
        return;
      }

      const validTypes = ['konser', 'sinema', 'spor', 'gezi', 'diger'];
      if (!validTypes.includes(eventType)) {
        res.status(400).json({ error: 'Invalid event type' });
        return;
      }

      const post = await prisma.post.create({
        data: {
          title,
          description: description || null,
          eventType,
          eventDate: new Date(eventDate),
          spotsNeeded: parseInt(spotsNeeded),
          authorId: req.user!.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              university: true,
              avatarUrl: true,
            },
          },
        },
      });

      res.status(201).json({ post });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
);

// DELETE /posts/:id — delete own post
router.delete(
  '/:id',
  authMiddleware,
  verifiedOnly,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const post = await prisma.post.findUnique({ where: { id: req.params.id } });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      if (post.authorId !== req.user!.id) {
        res.status(403).json({ error: 'You can only delete your own posts' });
        return;
      }

      await prisma.post.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
);

export default router;
