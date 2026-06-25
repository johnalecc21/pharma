/**
 * Extrae un mensaje legible de un error HTTP de Angular (HttpErrorResponse-like),
 * cuyo body sigue el formato { message: string | string[] } que devuelve el backend
 * (los arrays vienen de los errores de validación de class-validator).
 * Si no puede extraerlo, retorna el mensaje por defecto recibido.
 */
export function extraerMensajeError(error: unknown, mensajePorDefecto: string): string {
  const mensaje = (error as { error?: { message?: unknown } } | null)?.error?.message;

  if (typeof mensaje === 'string') {
    return mensaje;
  }

  if (Array.isArray(mensaje) && mensaje.every((item) => typeof item === 'string')) {
    return mensaje.join(', ');
  }

  return mensajePorDefecto;
}
