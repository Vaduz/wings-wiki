export function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

export function bytesToAlphanumeric(arrayBuffer: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from(new Uint8Array(arrayBuffer))
    .map((byte) => chars[byte % chars.length])
    .join('')
}

export function generateUserId(): string {
  return bytesToAlphanumeric(generateRandomBytes(22))
}

export function generateSpaceId(): string {
  return bytesToAlphanumeric(generateRandomBytes(8))
}

export function generateDocumentId(): string {
  return bytesToAlphanumeric(generateRandomBytes(24))
}
