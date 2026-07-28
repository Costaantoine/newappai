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

export interface LeaDemoEmailOptions {
  recipientEmail: string
  lang: string
  history: { role: 'user' | 'assistant'; content: string }[]
}

const LEA_EMAIL_SUBJECT: Record<string, string> = {
  fr: 'Récapitulatif de votre démo avec Léa — NewAppAI',
  en: 'Your Léa demo recap — NewAppAI',
  pt: 'Resumo da sua demo com a Léa — NewAppAI',
  es: 'Resumen de tu demo con Léa — NewAppAI',
}

const LEA_EMAIL_INTRO: Record<string, string> = {
  fr: 'Voici le récapitulatif de votre échange avec Léa, notre assistante IA de démonstration.',
  en: 'Here is the recap of your conversation with Léa, our AI demo assistant.',
  pt: 'Aqui está o resumo da sua conversa com a Léa, a nossa assistente de IA de demonstração.',
  es: 'Aquí tiene el resumen de su conversación con Léa, nuestra asistente de IA de demostración.',
}

export async function sendLeaDemoEmail(opts: LeaDemoEmailOptions): Promise<boolean> {
  const transporter = createTransporter()
  if (!transporter) return false

  const siteName = process.env.SITE_NAME || 'NewAppAI'
  const subject = LEA_EMAIL_SUBJECT[opts.lang] || LEA_EMAIL_SUBJECT.fr
  const intro = LEA_EMAIL_INTRO[opts.lang] || LEA_EMAIL_INTRO.fr

  const transcriptText = opts.history
    .map(m => `${m.role === 'user' ? 'Vous' : 'Léa'} : ${m.content}`)
    .join('\n\n')

  const transcriptHtml = opts.history
    .map(m => `
      <div style="margin-bottom: 12px; padding: 10px 14px; border-radius: 10px; background: ${m.role === 'user' ? '#f1f5f9' : '#ede9fe'};">
        <strong style="color: ${m.role === 'user' ? '#334155' : '#7c3aed'};">${m.role === 'user' ? 'Vous' : 'Léa'}</strong>
        <p style="margin: 4px 0 0; white-space: pre-wrap;">${escapeHtml(m.content)}</p>
      </div>
    `)
    .join('')

  try {
    await transporter.sendMail({
      from: `"Léa — ${siteName}" <${process.env.SMTP_USER}>`,
      to: opts.recipientEmail,
      subject,
      text: `${intro}\n\n${transcriptText}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">${escapeHtml(subject)}</h2>
          <p style="color: #475569;">${escapeHtml(intro)}</p>
          <div style="margin-top: 20px;">${transcriptHtml}</div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Envoyé via la démo Chatbot IA de ${escapeHtml(siteName)}</p>
        </div>
      `,
    })
    logger.info({ to: opts.recipientEmail }, 'Lea demo email sent')
    return true
  } catch (error) {
    logger.error({ error }, 'Failed to send Lea demo email')
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
