import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FormMedicamentoComponent } from './form-medicamento.component';
import { MedicamentoService } from '../../services/medicamento.service';
import { Medicamento } from '../../models/medicamento.model';

function crearMedicamento(): Medicamento {
  return {
    id: 'med-1',
    nombre: 'Paracetamol',
    categoria: 'Analgésicos',
    sku: 'PARA500',
    precioUnitario: 5,
    stock: 20,
    fechaVencimiento: '2026-12-01T00:00:00.000Z',
    stockCritico: false,
    vencimientoProximo: false,
    diasParaVencer: 100,
  };
}

describe('FormMedicamentoComponent', () => {
  let medicamentoService: jest.Mocked<MedicamentoService>;
  let component: FormMedicamentoComponent;

  beforeEach(() => {
    medicamentoService = {
      listar: jest.fn(),
      obtenerPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      listarCategorias: jest.fn(),
    } as unknown as jest.Mocked<MedicamentoService>;

    component = new FormMedicamentoComponent(new FormBuilder(), medicamentoService);
  });

  it('esEdicion es false cuando no hay medicamentoId', () => {
    expect(component.esEdicion).toBe(false);
  });

  it('al inicializar en modo edición, precarga el formulario', () => {
    component.medicamentoId = 'med-1';
    medicamentoService.obtenerPorId.mockReturnValue(of(crearMedicamento()));

    component.ngOnInit();

    expect(component.esEdicion).toBe(true);
    expect(component.form.value.nombre).toBe('Paracetamol');
    expect(component.form.value.fechaVencimiento).toBe('2026-12-01');
  });

  it('ngOnInit no consulta el servicio en modo creación', () => {
    component.ngOnInit();

    expect(medicamentoService.obtenerPorId).not.toHaveBeenCalled();
  });

  it('no guarda si el formulario es inválido', () => {
    component.guardar();

    expect(medicamentoService.crear).not.toHaveBeenCalled();
    expect(component.form.get('nombre')?.touched).toBe(true);
  });

  it('crea un medicamento nuevo cuando no hay medicamentoId', () => {
    component.form.setValue({
      nombre: 'Paracetamol',
      categoria: 'Analgésicos',
      sku: 'PARA500',
      precioUnitario: 5,
      stock: 20,
      fechaVencimiento: '2026-12-01',
    });
    medicamentoService.crear.mockReturnValue(of(crearMedicamento()));
    const guardadoSpy = jest.spyOn(component.guardado, 'emit');

    component.guardar();

    expect(medicamentoService.crear).toHaveBeenCalled();
    expect(guardadoSpy).toHaveBeenCalled();
    expect(component.guardando()).toBe(false);
  });

  it('actualiza un medicamento existente cuando hay medicamentoId', () => {
    component.medicamentoId = 'med-1';
    component.form.setValue({
      nombre: 'Paracetamol',
      categoria: 'Analgésicos',
      sku: 'PARA500',
      precioUnitario: 5,
      stock: 20,
      fechaVencimiento: '2026-12-01',
    });
    medicamentoService.actualizar.mockReturnValue(of(crearMedicamento()));

    component.guardar();

    expect(medicamentoService.actualizar).toHaveBeenCalledWith('med-1', expect.any(Object));
  });

  it('en error, expone el mensaje del backend', () => {
    component.form.setValue({
      nombre: 'Paracetamol',
      categoria: 'Analgésicos',
      sku: 'PARA500',
      precioUnitario: 5,
      stock: 20,
      fechaVencimiento: '2026-12-01',
    });
    medicamentoService.crear.mockReturnValue(throwError(() => ({ error: { message: 'SKU duplicado' } })));

    component.guardar();

    expect(component.errorMensaje()).toBe('SKU duplicado');
    expect(component.guardando()).toBe(false);
  });

  it('cancelado.emit() puede invocarse directamente', () => {
    const cancelSpy = jest.spyOn(component.cancelado, 'emit');

    component.cancelado.emit();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
