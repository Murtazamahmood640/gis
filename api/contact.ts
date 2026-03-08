import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../backend/config/database.ts';
import { Contact } from '../backend/models/Contact.ts';
import { sendEmail, getContactAcknowledgmentEmail } from '../backend/services/emailService.ts';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await connectDB();

  try {
    if (req.method === 'POST') {
      // Create new contact submission
      const contactData = req.body;

      if (!contactData.fullName || !contactData.email || !contactData.message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields (fullName, email, message)',
        });
      }

      const contact = new Contact(contactData);
      await contact.save();

      // Send acknowledgment email to customer
      try {
        await sendEmail({
          to: contactData.email,
          subject: 'Thank you for contacting Luxe Detail Booker',
          html: getContactAcknowledgmentEmail({
            fullName: contactData.fullName,
          }),
        });

        // Send admin notification
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'info@vornoxlab.com',
          subject: `New Contact Form Submission - ${contactData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${contactData.fullName}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Phone:</strong> ${contactData.phone}</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <h3>Message:</h3>
              <p>${contactData.message}</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue even if email fails
      }

      return res.status(201).json({
        success: true,
        message: 'Contact submission received successfully',
        data: contact,
      });
    } else if (req.method === 'GET') {
      // Get all contact submissions (admin only)
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: contacts,
      });
    } else {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed',
      });
    }
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
