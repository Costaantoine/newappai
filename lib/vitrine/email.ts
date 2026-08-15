// Envoi de l'email de confirmation « Votre site est en ligne ! » pour un
// job vitrine livré. Réutilise la config SMTP déjà en place (lib/email.ts) :
// SMTP_HOST / SMTP_USER / SMTP_PASS / SMTP_PORT (+ SMTP_FROM en expéditeur,
// sinon SMTP_USER). Sans config SMTP, la fonction journalise et retourne
// false — jamais d'envoi simulé.

import nodemailer from 'nodemailer'
import logger from '@/lib/logger'

export interface DeliveryEmailOptions {
  /** Email du client (destinataire). */
  to: string
  /** Sous-domaine déployé (ex. « mon-salon »). */
  slug: string
  /** URL d'aperçu (toujours disponible, même avant déploiement). */
  previewUrl: string
  /** URL de téléchargement du zip. */
  downloadUrl: string
}

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    logger.warn('SMTP not configured — delivery email will not be sent (set SMTP_HOST, SMTP_USER, SMTP_PASS)')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

/** Envoie l'email de confirmation de livraison. Retourne false (sans lever)
 * si SMTP n'est pas configuré ou si l'envoi échoue. */
export async function sendDeliveryEmail(opts: DeliveryEmailOptions): Promise<boolean> {
  const transporter = createTransporter()
  if (!transporter) return false

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!
  const siteName = process.env.SITE_NAME || 'NewAppAI'
  const publicUrl = `https://${opts.slug}.newappai.com`

  try {
    await transporter.sendMail({
      from: `"${siteName}" <${from}>`,
      to: opts.to,
      subject: 'Votre site est en ligne !',
      text: [
        `Bonjour,`,
        ``,
        `Bonne nouvelle : votre site vitrine est en ligne.`,
        ``,
        `Site public : ${publicUrl}`,
        `Aperçu      : ${opts.previewUrl}`,
        `Télécharger le site (zip) : ${opts.downloadUrl}`,
        ``,
        `Merci de votre confiance,`,
        `${siteName}`,
      ].join('\n'),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Votre site est en ligne !</h2>
          <p>Bonjour,</p>
          <p>Bonne nouvelle : votre site vitrine est en ligne.</p>
          <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <p style="margin: 0 0 8px;"><strong>Site public :</strong> <a href="${escapeHtml(publicUrl)}">${escapeHtml(publicUrl)}</a></p>
            <p style="margin: 0 0 8px;"><strong>Aperçu :</strong> <a href="${escapeHtml(opts.previewUrl)}">${escapeHtml(opts.previewUrl)}</a></p>
            <p style="margin: 0;"><strong>Télécharger le site (zip) :</strong> <a href="${escapeHtml(opts.downloadUrl)}">${escapeHtml(opts.downloadUrl)}</a></p>
          </div>
          <p style="margin-top: 24px;">Merci de votre confiance,<br>${escapeHtml(siteName)}</p>
        </div>
      `,
    })
    logger.info({ to: opts.to, slug: opts.slug }, 'Delivery email sent')
    return true
  } catch (error) {
    logger.error({ error }, 'Failed to send delivery email')
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
