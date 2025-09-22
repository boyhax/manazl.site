import { NextResponse } from 'next/server'
import { ContactFormSchema } from '@/app/contact/schema'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate form data
    const validatedData = ContactFormSchema.parse(body)

    // Prepare email
    const msg = {
      to: process.env.CONTACT_EMAIL!,
      from: process.env.CONTACT_FROM_EMAIL!,
      replyTo: validatedData.email,
      subject: `New Contact Form: ${validatedData.subject}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    };

    await sgMail.send(msg)

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    )
  }
}