import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../backend/config/database.ts';
import { Coupon } from '../../backend/models/Coupon.ts';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    await connectDB();

    // Find the first active coupon that hasn't expired
    const activeCoupon = await Coupon.findOne({
      isActive: true,
      expiryDate: { $gt: new Date() },
    });

    if (!activeCoupon) {
      return res.status(200).json({
        success: true,
        coupon: null,
        message: 'No active coupon available',
      });
    }

    return res.status(200).json({
      success: true,
      coupon: {
        code: activeCoupon.code,
        discountPercentage: activeCoupon.discountPercentage,
        expiryDate: activeCoupon.expiryDate,
      },
    });
  } catch (error) {
    console.error('Active coupon API error:', error);

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
