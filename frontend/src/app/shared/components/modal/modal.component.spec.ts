import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;

  beforeEach(() => {
    component = new ModalComponent();
  });

  it('emite cerrar cuando el click ocurre directamente sobre el backdrop', () => {
    const emitSpy = jest.spyOn(component.cerrar, 'emit');
    const target = {} as EventTarget;
    const event = { target, currentTarget: target } as unknown as MouseEvent;

    component.onBackdropClick(event);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('no emite cerrar cuando el click ocurre dentro del panel', () => {
    const emitSpy = jest.spyOn(component.cerrar, 'emit');
    const event = {
      target: {} as EventTarget,
      currentTarget: {} as EventTarget,
    } as unknown as MouseEvent;

    component.onBackdropClick(event);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
