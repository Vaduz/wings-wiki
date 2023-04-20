import crypto from 'crypto'

export function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const lowerChars = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function bytesToAlphanumeric(chars: string, arrayBuffer: Uint8Array): string {
  return Array.from(new Uint8Array(arrayBuffer))
    .map((byte) => chars[byte % chars.length])
    .join('')
}

export function generateUserId(): string {
  return bytesToAlphanumeric(chars, generateRandomBytes(23))
}

export function generateSpaceId(): string {
  return bytesToAlphanumeric(lowerChars, generateRandomBytes(25))
}

export function generateDocumentId(): string {
  return bytesToAlphanumeric(chars, generateRandomBytes(24))
}
