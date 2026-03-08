import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../backend/config/database.ts';
import { Appointment } from '../backend/models/Appointment.ts';
import { sendEmail, getBookingConfirmationEmail, getAdminNotificationEmail } from '../backend/services/emailService.ts';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await connectDB();

  try {
    if (req.method === 'GET') {
      // Get all appointments
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: appointments,
      });
    } else if (req.method === 'POST') {
      // Create new appointment
      const appointmentData = req.body;

      if (!appointmentData.fullName || !appointmentData.email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }

      const appointment = new Appointment(appointmentData);
      await appointment.save();

      // Send confirmation email to customer
      try {
        await sendEmail({
          to: appointmentData.email,
          subject: 'Luxe Detail Booker - Appointment Confirmation',
          html: getBookingConfirmationEmail({
            fullName: appointmentData.fullName,
            serviceType: appointmentData.serviceType,
            date: appointmentData.date,
            timeSlot: appointmentData.timeSlot,
            totalPrice: appointmentData.totalPrice,
          }),
        });

        // Send admin notification
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'info@vornoxlab.com',
          subject: 'New Booking - Luxe Detail Booker',
          html: getAdminNotificationEmail({
            fullName: appointmentData.fullName,
            phone: appointmentData.phone,
            email: appointmentData.email,
            serviceType: appointmentData.serviceType,
            date: appointmentData.date,
            timeSlot: appointmentData.timeSlot,
            vehicleName: appointmentData.vehicleName,
            totalPrice: appointmentData.totalPrice,
          }),
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue even if email fails
      }

      return res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment,
      });
    } else if (req.method === 'PUT') {
      // Update appointment
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment ID',
        });
      }

      const appointment = await Appointment.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        data: appointment,
      });
    } else if (req.method === 'DELETE') {
      // Delete appointment
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment ID',
        });
      }

      const appointment = await Appointment.findByIdAndDelete(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } else {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed',
      });
    }
  } catch (error) {
    console.error('Appointments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
