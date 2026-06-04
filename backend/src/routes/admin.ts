import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// GET /admin/pending — list users awaiting verification
router.get('/pending', adminMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: { isVerified: false },
      select: {
        id: true,
        name: true,
        email: true,
        university: true,
        cardImageUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ error: 'Failed to get pending users' });
  }
});

// PATCH /admin/verify/:userId — approve a user
router.patch(
  '/verify/:userId',
  adminMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.update({
        where: { id: req.params.userId },
        data: { isVerified: true },
        select: { id: true, name: true, email: true, isVerified: true },
      });

      res.json({ message: 'User verified successfully', user });
    } catch {
      res.status(404).json({ error: 'User not found' });
    }
  }
);

// PATCH /admin/reject/:userId — reject and delete a user
router.patch(
  '/reject/:userId',
  adminMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await prisma.user.delete({ where: { id: req.params.userId } });
      res.json({ message: 'User rejected and removed' });
    } catch {
      res.status(404).json({ error: 'User not found' });
    }
  }
);

// GET /admin/stats — basic platform stats
router.get('/stats', adminMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalUsers, verifiedUsers, totalPosts, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.post.count(),
      prisma.message.count(),
    ]);

    res.json({
      totalUsers,
      verifiedUsers,
      pendingUsers: totalUsers - verifiedUsers,
      totalPosts,
      totalMessages,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
