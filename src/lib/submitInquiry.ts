/**
 * StaticForms submission adapter for The Pluming Tales Company inquiries.
 * Routes form submissions to the configured recipient email via StaticForms API.
 * Reference: https://staticforms.dev / STATIC_FORMS_GUIDE.md
 */

const STATIC_FORMS_ENDPOINT = 'https://api.staticforms.dev/submit'
const STATIC_FORMS_REPLY_TO = '@'
const DEFAULT_SUBJECT_PREFIX = '[The Pluming Tales Inquiry]'

export interface InquiryFormData {
  name: string
  email: string
  phone: string
  company?: string
  date: string
  quantity: string | number
  budget: string
  location: string
  service: string
  project: string
  honeypot?: string
}

export type InquirySubmissionResult =
  | { status: 'success'; id?: string }
  | { status: 'unconfigured'; reason: string }
  | { status: 'error'; reason: string }

interface StaticFormsPayload {
  apiKey: string
  accessKey: string
  name: string
  email: string
  phone: string
  subject: string
  replyTo: string
  honeypot: string
  message: string
}

interface StaticFormsResponse {
  success: boolean
  message?: string
  id?: string
}

export function getStaticFormsKey(): string | undefined {
  const key = (
    import.meta.env.VITE_STATIC_FORMS_KEY ||
    import.meta.env.VITE_STATIC_FORMS_ACCESS_KEY
  )?.trim()
  return key && key.length > 0 ? key : undefined
}

export function isStaticFormsConfigured(): boolean {
  return Boolean(getStaticFormsKey())
}

function buildStructuredMessage(data: InquiryFormData): string {
  const lines: string[] = [
    '=== CLIENT DETAILS ===',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    data.company ? `Company: ${data.company}` : 'Company: N/A',
    '',
    '=== EVENT & COMMISSION DETAILS ===',
    `Service Requested: ${data.service}`,
    `Event Date: ${data.date}`,
    `Quantity: ${data.quantity}`,
    `Budget Range: ${data.budget}`,
    `Location: ${data.location}`,
    '',
    '=== PROJECT DESCRIPTION ===',
    data.project.trim(),
  ]

  return lines.join('\n')
}

export async function submitInquiry(
  data: InquiryFormData
): Promise<InquirySubmissionResult> {
  // Silent drop if spam honeypot is triggered
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { status: 'success' }
  }

  const apiKey = getStaticFormsKey()

  if (!apiKey) {
    console.warn(
      '[submitInquiry] StaticForms key is not configured. Submission payload:',
      data
    )
    return {
      status: 'unconfigured',
      reason:
        'StaticForms key is not configured. Please set VITE_STATIC_FORMS_KEY in .env.local to enable email forwarding.',
    }
  }

  const subject = `${DEFAULT_SUBJECT_PREFIX} ${data.service} - ${data.name}`

  const payload: StaticFormsPayload = {
    apiKey,
    accessKey: apiKey, // Dual compatibility for modern and legacy API versions
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject,
    replyTo: STATIC_FORMS_REPLY_TO,
    honeypot: '',
    message: buildStructuredMessage(data),
  }

  try {
    const response = await fetch(STATIC_FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = (await response.json()) as StaticFormsResponse

    if (response.ok && result.success) {
      return { status: 'success', id: result.id }
    }

    return {
      status: 'error',
      reason: result.message || `StaticForms request failed with HTTP ${response.status}.`,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown network failure'
    return {
      status: 'error',
      reason: `Network error: ${message}`,
    }
  }
}
