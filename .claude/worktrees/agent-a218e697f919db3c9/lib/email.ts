import nodemailer from 'nodemailer'
import logger from '@/lib/logger'

export interface ContactEmailOptions {
  name: string
  email: string
  subject: string
  message: string
}

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    logger.warn('SMTP not configured — emails will not be sent (set SMTP_HOST, SMTP_USER, SMTP_PASS)')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendContactEmail(opts: ContactEmailOptions): Promise<boolean> {
  const transporter = createTransporter()
  if (!transporter) return false

  const recipientEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER!
  const siteName = process.env.SITE_NAME || 'NewAppAI'

  try {
    await transporter.sendMail({
      from: `"${siteName}" <${process.env.SMTP_USER}>`,
      replyTo: `"${opts.name}" <${opts.email}>`,
      to: recipientEmail,
      subject: `[Contact] ${opts.subject} — ${opts.name}`,
      text: [
        `Nouveau message de contact`,
        ``,
        `Nom : ${opts.name}`,
        `Email : ${opts.email}`,
        `Sujet : ${opts.subject}`,
        ``,
        `Message :`,
        opts.message,
      ].join('\n'),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Nouveau message de contact</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">Nom</td><td style="padding: 8px;">${escapeHtml(opts.name)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">Email</td><td style="padding: 8px;"><a href="mailto:${escapeHtml(opts.email)}">${escapeHtml(opts.email)}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #64748b;">Sujet</td><td style="padding: 8px;">${escapeHtml(opts.subject)}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(opts.message)}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Envoyé via le formulaire de contact de ${escapeHtml(siteName)}</p>
        </div>
      `,
    })
    logger.info({ to: recipientEmail, from: opts.email }, 'Contact email sent')
    return true
  } catch (error) {
    logger.error({ error }, 'Failed to send contact email')
    return false
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
