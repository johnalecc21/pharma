import { NotFoundException } from '@nestjs/common';
import { MedicamentoService } from './medicamento.service';
import { MedicamentoAlertasService } from './medicamento-alertas.service';
import { MedicamentoFactory } from '../factories/medicamento.factory';
import { IMedicamentoRepository } from '../repositories/medicamento-repository.interface';
import { Medicamento } from '../entities/medicamento.entity';
import { SkuDuplicadoException } from '../../../common/exceptions/sku-duplicado.exception';

function crearMedicamento(id: string, sku: string): Medicamento {
  const medicamento = new Medicamento();
  medicamento.id = id;
  medicamento.nombre = 'Paracetamol';
  medicamento.categoria = 'Analgésicos';
  medicamento.sku = sku;
  medicamento.precioUnitario = 5;
  medicamento.stock = 20;
  medicamento.fechaVencimiento = '2026-12-01';
  return medicamento;
}

describe('MedicamentoService', () => {
  let repository: jest.Mocked<IMedicamentoRepository>;
  let service: MedicamentoService;

  beforeEach(() => {
    repository = {
      findAllPaginado: jest.fn(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      contarStockCritico: jest.fn(),
      contarVencimientoProximo: jest.fn(),
      contarTotal: jest.fn(),
      findConAlertas: jest.fn(),
      findCategoriasDistintas: jest.fn(),
    };

    service = new MedicamentoService(
      repository,
      new MedicamentoAlertasService(),
      new MedicamentoFactory(),
    );
  });

  describe('crear', () => {
    it('crea el medicamento cuando el SKU no existe (RN-01)', async () => {
      repository.findBySku.mockResolvedValue(null);
      repository.save.mockImplementation(async (medicamento) => medicamento);

      const resultado = await service.crear({
        nombre: 'Paracetamol',
        categoria: 'Analgésicos',
        sku: 'PARA500',
        precioUnitario: 5,
        stock: 20,
        fechaVencimiento: '2026-12-01',
      });

      expect(resultado.sku).toBe('PARA500');
      expect(repository.save).toHaveBeenCalled();
    });

    it('lanza SkuDuplicadoException cuando el SKU ya existe (RN-01)', async () => {
      repository.findBySku.mockResolvedValue(crearMedicamento('med-1', 'PARA500'));

      await expect(
        service.crear({
          nombre: 'Paracetamol',
          categoria: 'Analgésicos',
          sku: 'PARA500',
          precioUnitario: 5,
          stock: 20,
          fechaVencimiento: '2026-12-01',
        }),
      ).rejects.toThrow(SkuDuplicadoException);

      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('actualizar', () => {
    it('lanza NotFoundException cuando el medicamento no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.actualizar('inexistente', { stock: 5 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('lanza SkuDuplicadoException si el nuevo SKU pertenece a otro medicamento', async () => {
      const medicamento = crearMedicamento('med-1', 'PARA500');
      repository.findById.mockResolvedValue(medicamento);
      repository.findBySku.mockResolvedValue(crearMedicamento('med-2', 'OTRO123'));

      await expect(service.actualizar('med-1', { sku: 'OTRO123' })).rejects.toThrow(
        SkuDuplicadoException,
      );
    });

    it('actualiza sin validar SKU cuando no cambia', async () => {
      const medicamento = crearMedicamento('med-1', 'PARA500');
      repository.findById.mockResolvedValue(medicamento);
      repository.save.mockImplementation(async (m) => m);

      const resultado = await service.actualizar('med-1', { stock: 50 });

      expect(repository.findBySku).not.toHaveBeenCalled();
      expect(resultado.stock).toBe(50);
    });
  });

  describe('eliminar', () => {
    it('lanza NotFoundException cuando el medicamento no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.eliminar('inexistente')).rejects.toThrow(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('elimina (soft delete) cuando el medicamento existe', async () => {
      repository.findById.mockResolvedValue(crearMedicamento('med-1', 'PARA500'));
      repository.delete.mockResolvedValue(undefined);

      await service.eliminar('med-1');

      expect(repository.delete).toHaveBeenCalledWith('med-1');
    });
  });

  describe('listar', () => {
    it('pagina los resultados y mapea cada medicamento', async () => {
      repository.findAllPaginado.mockResolvedValue([
        [crearMedicamento('med-1', 'PARA500')],
        1,
      ]);

      const resultado = await service.listar({ pagina: 1, limite: 10 });

      expect(resultado.data).toHaveLength(1);
      expect(resultado.total).toBe(1);
      expect(resultado.totalPaginas).toBe(1);
    });
  });

  describe('obtenerPorId', () => {
    it('retorna el medicamento mapeado cuando existe', async () => {
      repository.findById.mockResolvedValue(crearMedicamento('med-1', 'PARA500'));

      const resultado = await service.obtenerPorId('med-1');

      expect(resultado.id).toBe('med-1');
    });
  });

  describe('listarCategorias', () => {
    it('delega en el repositorio', async () => {
      repository.findCategoriasDistintas.mockResolvedValue(['Analgésicos']);

      const resultado = await service.listarCategorias();

      expect(resultado).toEqual(['Analgésicos']);
    });
  });
});
