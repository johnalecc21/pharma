import { createHash, randomBytes } from 'crypto';

const BYTES_TOKEN_ALEATORIO = 64;

export function generarTokenAleatorio(): string {
  return randomBytes(BYTES_TOKEN_ALEATORIO).toString('hex');
}

export function hashearToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
