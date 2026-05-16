import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../utils/prisma';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { uploadCardImage, uploadAvatar } from '../utils/cloudinary';

const router = Router();

// Multer setup for local temp storage
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// POST /auth/register
router.post(
  '/register',
  upload.fields([
    { name: 'cardImage', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, university, bio, interests } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email and password are required' });
        return;
      }

      if (!files?.cardImage?.[0]) {
        res.status(400).json({ error: 'Student ID card image is required' });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }

      // Upload card image to Cloudinary
      const cardImageUrl = await uploadCardImage(files.cardImage[0].path);

      // Upload avatar if provided
      let avatarUrl: string | undefined;
      if (files?.avatar?.[0]) {
        avatarUrl = await uploadAvatar(files.avatar[0].path);
        fs.unlinkSync(files.avatar[0].path);
      }

      // Clean up temp file
      fs.unlinkSync(files.cardImage[0].path);

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Parse interests
      const interestsList = interests
        ? typeof interests === 'string'
          ? JSON.parse(interests)
          : interests
        : [];

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          university: university || null,
          bio: bio || null,
          avatarUrl: avatarUrl || null,
          cardImageUrl,
          interests: interestsList,
          isVerified: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          university: true,
          isVerified: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        message: 'Registration successful. Awaiting admin verification.',
        user,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// POST /auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        interests: user.interests,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        university: true,
        bio: true,
        avatarUrl: true,
        isVerified: true,
        interests: true,
        createdAt: true,
        _count: {
          select: { posts: true, applications: true },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;
