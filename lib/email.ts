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
  const contactFrom = process.env.SMTP_FROM || `"${siteName}" <${process.env.SMTP_USER}>`

  let notifyOk = false
  let confirmOk = false

  // 1. Notification interne (vers CONTACT_EMAIL)
  try {
    await transporter.sendMail({
      from: contactFrom,
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
    notifyOk = true
  } catch (error) {
    logger.error({ error }, 'Failed to send contact notification')
  }

  // 2. Confirmation client (vers l'adresse laissée dans le formulaire)
  try {
    await transporter.sendMail({
      from: contactFrom,
      replyTo: process.env.CONTACT_REPLY_TO || 'contact@newappai.com',
      to: opts.email,
      subject: `Confirmation de votre demande — ${siteName}`,
      text: [
        `Bonjour ${opts.name},`,
        ``,
        `Nous vous confirmons la bonne réception de votre demande au sujet de :`,
        `« ${opts.subject} »`,
        ``,
        `Nous vous répondrons dans les plus brefs délais à l'adresse : ${opts.email}`,
        ``,
        `Merci de votre confiance,`,
        `L'équipe ${siteName}`,
      ].join('\n'),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Confirmation de votre demande</h2>
          <p>Bonjour ${escapeHtml(opts.name)},</p>
          <p>Nous vous confirmons la bonne réception de votre demande au sujet de :</p>
          <p style="padding: 12px; background: #f8fafc; border-radius: 8px; font-style: italic;">« ${escapeHtml(opts.subject)} »</p>
          <p>Nous vous répondrons dans les plus brefs délais à l'adresse : <strong>${escapeHtml(opts.email)}</strong></p>
          <p style="margin-top: 24px;">Merci de votre confiance,<br><strong>L'équipe ${escapeHtml(siteName)}</strong></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="color: #94a3b8; font-size: 12px;">Ce message a été envoyé automatiquement suite à votre demande sur ${escapeHtml(siteName)}. Merci de ne pas répondre directement à cet email.</p>
        </div>
      `,
    })
    logger.info({ to: opts.email }, 'Contact confirmation sent')
    confirmOk = true
  } catch (error) {
    logger.error({ error }, 'Failed to send contact confirmation')
  }

  return notifyOk || confirmOk
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

export interface OrderConfirmationItem {
  title: string
  quantity: number
  /** Prix unitaire en centimes */
  price: number
}

export interface OrderConfirmationEmailOptions {
  customerEmail: string
  customerName: string
  items: OrderConfirmationItem[]
  /** Montant total payé en centimes */
  totalAmount: number
  /** Langue du client : fr | en | pt | es */
  language: string
  /** Identifiant de la commande (session Stripe) — les 8 derniers caractères servent de n° de commande */
  orderId: string
}

const ORDER_EMAIL_LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  pt: 'pt-PT',
  es: 'es-ES',
}

interface OrderEmailStrings {
  subject: string
  heading: string
  greeting: string
  intro: string
  orderLabel: string
  dateLabel: string
  thProduct: string
  thQty: string
  thUnit: string
  thTotal: string
  totalLabel: string
  closing: string
  team: string
  footer: string
}

const ORDER_EMAIL_STRINGS: Record<string, OrderEmailStrings> = {
  fr: {
    subject: 'Confirmation de votre commande — NewAppAI',
    heading: 'Merci pour votre commande !',
    greeting: 'Bonjour',
    intro: 'Nous vous confirmons que votre paiement a bien été reçu et que votre commande est enregistrée.',
    orderLabel: 'Numéro de commande',
    dateLabel: 'Date',
    thProduct: 'Produit',
    thQty: 'Qté',
    thUnit: 'Prix unitaire',
    thTotal: 'Total',
    totalLabel: 'Total payé',
    closing: 'Merci de votre confiance.',
    team: "L'équipe NewAppAI",
    footer: 'Ce message a été envoyé automatiquement suite à votre paiement sur NewAppAI. Merci de ne pas répondre directement à cet email.',
  },
  en: {
    subject: 'Order confirmation — NewAppAI',
    heading: 'Thank you for your order!',
    greeting: 'Hello',
    intro: 'We confirm that your payment has been received and that your order has been recorded.',
    orderLabel: 'Order number',
    dateLabel: 'Date',
    thProduct: 'Product',
    thQty: 'Qty',
    thUnit: 'Unit price',
    thTotal: 'Total',
    totalLabel: 'Total paid',
    closing: 'Thank you for your trust.',
    team: 'The NewAppAI team',
    footer: 'This message was sent automatically after your payment on NewAppAI. Please do not reply directly to this email.',
  },
  pt: {
    subject: 'Confirmação da sua encomenda — NewAppAI',
    heading: 'Obrigado pela sua encomenda!',
    greeting: 'Olá',
    intro: 'Confirmamos que o seu pagamento foi recebido e que a sua encomenda foi registada.',
    orderLabel: 'Número da encomenda',
    dateLabel: 'Data',
    thProduct: 'Produto',
    thQty: 'Qtd',
    thUnit: 'Preço unitário',
    thTotal: 'Total',
    totalLabel: 'Total pago',
    closing: 'Obrigado pela sua confiança.',
    team: 'A equipa NewAppAI',
    footer: 'Esta mensagem foi enviada automaticamente após o seu pagamento na NewAppAI. Por favor, não responda diretamente a este email.',
  },
  es: {
    subject: 'Confirmación de su pedido — NewAppAI',
    heading: '¡Gracias por su pedido!',
    greeting: 'Hola',
    intro: 'Le confirmamos que hemos recibido su pago y que su pedido ha quedado registrado.',
    orderLabel: 'Número de pedido',
    dateLabel: 'Fecha',
    thProduct: 'Producto',
    thQty: 'Cant.',
    thUnit: 'Precio unitario',
    thTotal: 'Total',
    totalLabel: 'Total pagado',
    closing: 'Gracias por su confianza.',
    team: 'El equipo de NewAppAI',
    footer: 'Este mensaje se ha enviado automáticamente tras su pago en NewAppAI. Por favor, no responda directamente a este correo.',
  },
}

function formatOrderAmount(cents: number, language: string): string {
  const locale = ORDER_EMAIL_LOCALES[language] || ORDER_EMAIL_LOCALES.fr
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format((cents || 0) / 100)
}

function formatOrderDate(date: Date, language: string): string {
  const locale = ORDER_EMAIL_LOCALES[language] || ORDER_EMAIL_LOCALES.fr
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export async function sendOrderConfirmationEmail(opts: OrderConfirmationEmailOptions): Promise<boolean> {
  const transporter = createTransporter()
  if (!transporter) return false

  const siteName = process.env.SITE_NAME || 'NewAppAI'
  const language = ORDER_EMAIL_STRINGS[opts.language] ? opts.language : 'fr'
  const s = ORDER_EMAIL_STRINGS[language]
  const from = process.env.SMTP_FROM || `"${siteName}" <${process.env.SMTP_USER}>`

  const customerName = (opts.customerName || '').trim()
  const greeting = customerName ? `${s.greeting} ${customerName},` : `${s.greeting},`
  const orderNumber = (opts.orderId || '').slice(-8).toUpperCase()
  const dateStr = formatOrderDate(new Date(), language)
  const items = Array.isArray(opts.items) ? opts.items : []
  const totalStr = formatOrderAmount(opts.totalAmount, language)

  const rowsHtml = items
    .map(item => {
      const quantity = item.quantity || 1
      const unit = formatOrderAmount(item.price, language)
      const line = formatOrderAmount((item.price || 0) * quantity, language)
      return `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(String(item.title || ''))}</td>
          <td align="center" style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${quantity}</td>
          <td align="right" style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(unit)}</td>
          <td align="right" style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${escapeHtml(line)}</td>
        </tr>`
    })
    .join('')

  const textLines = items
    .map(item => {
      const quantity = item.quantity || 1
      const line = formatOrderAmount((item.price || 0) * quantity, language)
      return `- ${item.title} x${quantity} : ${line}`
    })
    .join('\n')

  try {
    await transporter.sendMail({
      from,
      to: opts.customerEmail,
      subject: s.subject,
      text: [
        greeting,
        '',
        s.intro,
        '',
        `${s.orderLabel} : #${orderNumber}`,
        `${s.dateLabel} : ${dateStr}`,
        '',
        `${s.thProduct} :`,
        textLines,
        '',
        `${s.totalLabel} : ${totalStr}`,
        '',
        s.closing,
        s.team,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #0f172a;">
          <div style="background: #7c3aed; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 20px; margin: 0; letter-spacing: 0.5px;">${escapeHtml(siteName)}</h1>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #7c3aed; margin: 0 0 16px;">${escapeHtml(s.heading)}</h2>
            <p style="margin: 0 0 12px;">${escapeHtml(greeting)}</p>
            <p style="color: #475569; margin: 0 0 20px;">${escapeHtml(s.intro)}</p>

            <table style="width: 100%; border-collapse: collapse; background: #f5f3ff; border-radius: 8px; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">${escapeHtml(s.orderLabel)}</td>
                <td style="padding: 10px 14px; font-weight: bold; text-align: right;">#${escapeHtml(orderNumber)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">${escapeHtml(s.dateLabel)}</td>
                <td style="padding: 10px 14px; text-align: right;">${escapeHtml(dateStr)}</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #7c3aed; color: #ffffff;">
                  <th align="left" style="padding: 10px 12px; font-size: 13px;">${escapeHtml(s.thProduct)}</th>
                  <th align="center" style="padding: 10px 12px; font-size: 13px;">${escapeHtml(s.thQty)}</th>
                  <th align="right" style="padding: 10px 12px; font-size: 13px;">${escapeHtml(s.thUnit)}</th>
                  <th align="right" style="padding: 10px 12px; font-size: 13px;">${escapeHtml(s.thTotal)}</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
                <tr>
                  <td colspan="3" align="right" style="padding: 12px; font-weight: bold; border-top: 2px solid #7c3aed;">${escapeHtml(s.totalLabel)}</td>
                  <td align="right" style="padding: 12px; font-weight: bold; color: #7c3aed; border-top: 2px solid #7c3aed;">${escapeHtml(totalStr)}</td>
                </tr>
              </tbody>
            </table>

            <p style="margin: 24px 0 0;">${escapeHtml(s.closing)}<br><strong>${escapeHtml(s.team)}</strong></p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">${escapeHtml(s.footer)}</p>
          </div>
        </div>
      `,
    })
    logger.info({ to: opts.customerEmail, order: orderNumber, lang: language }, 'Order confirmation email sent')
    return true
  } catch (error) {
    logger.error({ error, to: opts.customerEmail, order: orderNumber }, 'Failed to send order confirmation email')
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
