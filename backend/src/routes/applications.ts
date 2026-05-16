import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authMiddleware, verifiedOnly, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// POST /posts/:postId/apply — apply to a post
router.post(
  '/posts/:postId/apply',
  authMiddleware,
  verifiedOnly,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { postId } = req.params;
      const applicantId = req.user!.id;

      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      if (post.authorId === applicantId) {
        res.status(400).json({ error: 'You cannot apply to your own post' });
        return;
      }

      if (!post.isActive) {
        res.status(400).json({ error: 'This post is no longer active' });
        return;
      }

      // Check spots
      const acceptedCount = await prisma.application.count({
        where: { postId, status: 'accepted' },
      });

      if (acceptedCount >= post.spotsNeeded) {
        res.status(400).json({ error: 'No spots left for this event' });
        return;
      }

      const application = await prisma.application.create({
        data: { postId, applicantId },
        include: {
          applicant: {
            select: { id: true, name: true, avatarUrl: true, university: true },
          },
          post: {
            select: { id: true, title: true },
          },
        },
      });

      res.status(201).json({ application });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        res.status(409).json({ error: 'You have already applied to this post' });
        return;
      }
      console.error('Apply error:', error);
      res.status(500).json({ error: 'Failed to apply' });
    }
  }
);

// GET /posts/:postId/applications — get applications for a post (post owner only)
router.get(
  '/posts/:postId/applications',
  authMiddleware,
  verifiedOnly,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { postId } = req.params;

      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      if (post.authorId !== req.user!.id) {
        res.status(403).json({ error: 'Only post owner can view applications' });
        return;
      }

      const applications = await prisma.application.findMany({
        where: { postId },
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              university: true,
              bio: true,
              interests: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ applications });
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ error: 'Failed to get applications' });
    }
  }
);

// PATCH /applications/:id/accept — accept an application
router.patch(
  '/:id/accept',
  authMiddleware,
  verifiedOnly,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const application = await prisma.application.findUnique({
        where: { id: req.params.id },
        include: { post: true },
      });

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      if (application.post.authorId !== req.user!.id) {
        res.status(403).json({ error: 'Only post owner can accept applications' });
        return;
      }

      if (application.status !== 'pending') {
        res.status(400).json({ error: 'Application already processed' });
        return;
      }

      // Update application status
      const updated = await prisma.application.update({
        where: { id: req.params.id },
        data: { status: 'accepted' },
      });

      // Create conversation between post owner and applicant
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              { userId: req.user!.id },
              { userId: application.applicantId },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, avatarUrl: true, university: true },
              },
            },
          },
        },
      });

      res.json({ application: updated, conversation });
    } catch (error) {
      console.error('Accept application error:', error);
      res.status(500).json({ error: 'Failed to accept application' });
    }
  }
);

// PATCH /applications/:id/reject — reject an application
router.patch(
  '/:id/reject',
  authMiddleware,
  verifiedOnly,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const application = await prisma.application.findUnique({
        where: { id: req.params.id },
        include: { post: true },
      });

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      if (application.post.authorId !== req.user!.id) {
        res.status(403).json({ error: 'Only post owner can reject applications' });
        return;
      }

      const updated = await prisma.application.update({
        where: { id: req.params.id },
        data: { status: 'rejected' },
      });

      res.json({ application: updated });
    } catch (error) {
      console.error('Reject application error:', error);
      res.status(500).json({ error: 'Failed to reject application' });
    }
  }
);

export default router;
