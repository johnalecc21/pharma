import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
  it('inicia con el sidebar abierto', () => {
    const component = new AppShellComponent({} as never);

    expect(component.sidebarAbierto()).toBe(true);
  });

  it('alternarSidebar invierte el estado', () => {
    const component = new AppShellComponent({} as never);

    component.alternarSidebar();
    expect(component.sidebarAbierto()).toBe(false);

    component.alternarSidebar();
    expect(component.sidebarAbierto()).toBe(true);
  });
});
