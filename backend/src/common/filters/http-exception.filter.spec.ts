import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function crearHost(url: string): { host: ArgumentsHost; json: jest.Mock; status: jest.Mock } {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ url }),
    }),
  } as unknown as ArgumentsHost;

  return { host, json, status };
}

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('responde con el status y mensaje de una HttpException con mensaje string', () => {
    const { host, json, status } = crearHost('/medicamentos/1');

    filter.catch(new NotFoundException('Medicamento no encontrado'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        path: '/medicamentos/1',
        message: 'Medicamento no encontrado',
      }),
    );
  });

  it('extrae el mensaje de excepciones con response en formato objeto (class-validator)', () => {
    const { host, json } = crearHost('/auth/register');

    filter.catch(new BadRequestException(['El email es inválido']), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: ['El email es inválido'] }),
    );
  });

  it('usa el mensaje propio de la excepción cuando la response no incluye "message"', () => {
    const { host, json } = crearHost('/medicamentos');

    const exception = new HttpException({ error: 'Forbidden' }, HttpStatus.FORBIDDEN);
    exception.message = 'Forbidden';

    filter.catch(exception, host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Forbidden' }),
    );
  });

  it('responde 500 genérico para errores no controlados, sin filtrar el detalle interno', () => {
    const { host, json, status } = crearHost('/dashboard/kpis');

    filter.catch(new Error('conexión perdida con la base de datos'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ha ocurrido un error inesperado',
      }),
    );
  });
});
