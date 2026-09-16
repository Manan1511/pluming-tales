import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  submitInquiry,
  isStaticFormsConfigured,
  getStaticFormsKey,
  type InquiryFormData,
} from './submitInquiry'

const sampleFormData: InquiryFormData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+91 98765 43210',
  company: 'Studio Atelier',
  date: '2026-11-20',
  quantity: '150',
  budget: 'INR 50,000 - 1,00,000',
  location: 'Mumbai, Maharashtra',
  service: 'Wedding Stationery & Calligraphy',
  project: 'Custom luxury foil invitations and calligraphy place cards for our reception.',
}

describe('submitInquiry adapter', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('silently ignores submissions when honeypot field is populated', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    const result = await submitInquiry({
      ...sampleFormData,
      honeypot: 'spam-bot-value',
    })

    expect(result).toEqual({ status: 'success' })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns unconfigured status when no StaticForms key is present', async () => {
    vi.stubEnv('VITE_STATIC_FORMS_KEY', '')
    vi.stubEnv('VITE_STATIC_FORMS_ACCESS_KEY', '')

    const result = await submitInquiry(sampleFormData)

    expect(result.status).toBe('unconfigured')
    expect(isStaticFormsConfigured()).toBe(false)
    expect(getStaticFormsKey()).toBeUndefined()
  })

  it('submits correctly to StaticForms endpoint when key is configured', async () => {
    const TEST_KEY = 'sf_test_key_abc123'
    vi.stubEnv('VITE_STATIC_FORMS_KEY', TEST_KEY)

    expect(isStaticFormsConfigured()).toBe(true)
    expect(getStaticFormsKey()).toBe(TEST_KEY)

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, id: 'sub_12345' }),
    } as Response)

    const result = await submitInquiry(sampleFormData)

    expect(result).toEqual({ status: 'success', id: 'sub_12345' })
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const [calledUrl, requestInit] = fetchSpy.mock.calls[0]
    expect(calledUrl).toBe('https://api.staticforms.dev/submit')
    expect(requestInit?.method).toBe('POST')

    const parsedBody = JSON.parse(requestInit?.body as string)
    expect(parsedBody.apiKey).toBe(TEST_KEY)
    expect(parsedBody.accessKey).toBe(TEST_KEY)
    expect(parsedBody.name).toBe('Jane Doe')
    expect(parsedBody.email).toBe('jane@example.com')
    expect(parsedBody.phone).toBe('+91 98765 43210')
    expect(parsedBody.replyTo).toBe('@')
    expect(parsedBody.honeypot).toBe('')
    expect(parsedBody.subject).toContain('[The Pluming Tales Inquiry]')
    expect(parsedBody.message).toContain('=== CLIENT DETAILS ===')
    expect(parsedBody.message).toContain('Studio Atelier')
    expect(parsedBody.message).toContain('Wedding Stationery & Calligraphy')
  })

  it('handles StaticForms API error response', async () => {
    vi.stubEnv('VITE_STATIC_FORMS_KEY', 'sf_test_key_abc123')

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ success: false, message: 'Invalid access key' }),
    } as Response)

    const result = await submitInquiry(sampleFormData)

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.reason).toContain('Invalid access key')
    }
  })

  it('handles network failure gracefully', async () => {
    vi.stubEnv('VITE_STATIC_FORMS_KEY', 'sf_test_key_abc123')

    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new Error('Failed to fetch')
    )

    const result = await submitInquiry(sampleFormData)

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.reason).toContain('Network error: Failed to fetch')
    }
  })
})
