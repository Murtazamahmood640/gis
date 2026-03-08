import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../backend/config/database.ts';
import { Review } from '../backend/models/Review.ts';
import { verifyToken } from '../backend/utils/jwt.ts';
import type { JwtPayload } from '../backend/utils/jwt.ts';

async function getTokenFromRequest(req: VercelRequest): Promise<JwtPayload | null> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  return verifyToken(token);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await connectDB();

  try {
    /* ===========================
       GET - List approved reviews (public)
    ============================ */
    if (req.method === 'GET') {
      // Check if user is admin for unfiltered access
      const user = await getTokenFromRequest(req);
      const isAdmin = user?.role === 'admin';

      const { search, status } = req.query;

      let query: any = {};

      // Only show approved reviews for non-admin users
      if (!isAdmin) {
        query.isApproved = true;
      } else {
        // Admin can filter by approval status
        if (status && status !== 'all') {
          query.isApproved = status === 'approved';
        }
      }

      // Search by name or email
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .limit(500);

      return res.status(200).json({
        success: true,
        reviews,
      });
    }

    /* ===========================
       POST - Submit new review (public)
    ============================ */
    if (req.method === 'POST') {
      const { name, email, rating, text, avatar } = req.body;

      // Validation
      if (!name || !email || !rating || !text || !avatar) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }

      if (text.length < 10 || text.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Review text must be between 10 and 1000 characters',
        });
      }

      // Create review (not approved by default)
      const newReview = new Review({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        rating,
        text: text.trim(),
        avatar: avatar.trim(),
        isApproved: false,
      });

      await newReview.save();

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully. It will appear after admin approval.',
        review: newReview,
      });
    }

    // Admin-only endpoints require authentication
    const user = await getTokenFromRequest(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for this action',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required for this action',
      });
    }

    /* ===========================
       PUT - Update review approval status
    ============================ */
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { isApproved } = req.body;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Review ID is required',
        });
      }

      const updateData: any = {};
      if (isApproved !== undefined) updateData.isApproved = isApproved;

      const updatedReview = await Review.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedReview) {
        return res.status(404).json({
          success: false,
          message: 'Review not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: `Review ${isApproved ? 'approved' : 'unapproved'} successfully`,
        review: updatedReview,
      });
    }

    /* ===========================
       DELETE - Delete review
    ============================ */
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Review ID is required',
        });
      }

      const deletedReview = await Review.findByIdAndDelete(id);

      if (!deletedReview) {
        return res.status(404).json({
          success: false,
          message: 'Review not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    }

    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  } catch (error) {
    console.error('Review API error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error:
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
}
