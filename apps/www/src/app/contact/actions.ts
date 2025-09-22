'use server'

import { z } from 'zod'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const ContactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required").max(1000),
})

export type ContactFormType = z.infer<typeof ContactFormSchema>

export async function submitContactForm(formData: ContactFormType) {
  try {
    // Validate form data
    const validatedData = ContactFormSchema.parse(formData)

    // Prepare email content
    const msg = {
      to: process.env.CONTACT_EMAIL!,
      from: process.env.CONTACT_EMAIL!, // Verified sender email
      replyTo: validatedData.email,
      subject: `New Contact Form Submission from ${validatedData.firstName} ${validatedData.lastName}`,
      text: validatedData.message,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    }

    // Send email
    try {
      await sgMail.send(msg)
      
      // Send confirmation email to user
      const confirmationMsg = {
        to: validatedData.email,
        from: process.env.CONTACT_EMAIL!,
        subject: 'Thank you for contacting Manazl',
        text: `
          Dear ${validatedData.firstName},

          Thank you for contacting Manazl. We have received your message and will get back to you shortly.

          Best regards,
          The Manazl Team
        `,
        html: `
          <div>
            <h2>Thank you for contacting Manazl</h2>
            <p>Dear ${validatedData.firstName},</p>
            <p>Thank you for contacting Manazl. We have received your message and will get back to you shortly.</p>
            <p>Best regards,<br>The Manazl Team</p>
          </div>
        `,
      }

      await sgMail.send(confirmationMsg)

      return {
        success: true,
        message: 'Message sent successfully!',
      }
    } catch (error) {
      console.error('SendGrid Error:', error)
      return {
        success: false,
        message: 'Failed to send email',
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      }
    }

    console.error('Contact Form Error:', error)
    return {
      success: false,
      message: 'Something went wrong',
    }
  }
}