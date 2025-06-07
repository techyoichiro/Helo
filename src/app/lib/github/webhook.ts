import { createHmac } from 'crypto'

export function verifyGitHubWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  const calculatedSignature = `sha256=${digest}`
  
  return signature === calculatedSignature
}

export function getGitHubEventType(headers: Headers): string | null {
  return headers.get('x-github-event')
}

export function getGitHubDeliveryId(headers: Headers): string | null {
  return headers.get('x-github-delivery')
} 