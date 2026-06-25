import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicamentoService } from '../../services/medicamento.service';
import { extraerMensajeError } from '../../../../shared/utils/http-error.util';

@Component({
  selector: 'app-form-medicamento',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-medicamento.component.html',
})
export class FormMedicamentoComponent implements OnInit {
  @Input() medicamentoId: string | null = null;
  @Output() guardado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  readonly form;
  readonly guardando = signal(false);
  readonly errorMensaje = signal<string | null>(null);

  get esEdicion(): boolean {
    return this.medicamentoId !== null;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly medicamentoService: MedicamentoService,
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      categoria: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.minLength(2)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      fechaVencimiento: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (!this.medicamentoId) {
      return;
    }

    this.medicamentoService.obtenerPorId(this.medicamentoId).subscribe((medicamento) => {
      this.form.patchValue({
        nombre: medicamento.nombre,
        categoria: medicamento.categoria,
        sku: medicamento.sku,
        precioUnitario: medicamento.precioUnitario,
        stock: medicamento.stock,
        fechaVencimiento: medicamento.fechaVencimiento.substring(0, 10),
      });
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.errorMensaje.set(null);

    const valores = this.form.getRawValue();
    const dto = {
      nombre: valores.nombre ?? '',
      categoria: valores.categoria ?? '',
      sku: valores.sku ?? '',
      precioUnitario: valores.precioUnitario ?? 0,
      stock: valores.stock ?? 0,
      fechaVencimiento: valores.fechaVencimiento ?? '',
    };

    const peticion = this.medicamentoId
      ? this.medicamentoService.actualizar(this.medicamentoId, dto)
      : this.medicamentoService.crear(dto);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.emit();
      },
      error: (error: unknown) => {
        this.guardando.set(false);
        this.errorMensaje.set(extraerMensajeError(error, 'No se pudo guardar el medicamento'));
      },
    });
  }
}
