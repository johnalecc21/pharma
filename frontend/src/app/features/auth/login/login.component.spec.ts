import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/role.enum';

describe('LoginComponent', () => {
  let authService: { login: jest.Mock };
  let router: { navigate: jest.Mock };
  let component: LoginComponent;

  beforeEach(() => {
    authService = { login: jest.fn() };
    router = { navigate: jest.fn() };
    component = new LoginComponent(new FormBuilder(), authService as unknown as AuthService, router as never);
  });

  it('no envía si el formulario es inválido y marca los campos como touched', () => {
    component.enviar();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.form.get('email')?.touched).toBe(true);
  });

  it('en éxito, navega al dashboard', () => {
    component.form.setValue({ email: 'admin@pharmadash.com', password: 'password123' });
    authService.login.mockReturnValue(
      of({
        accessToken: 't',
        refreshToken: 'r',
        usuario: { id: '1', nombre: 'Admin', email: 'a@a.com', rol: Role.ADMINISTRADOR },
      }),
    );

    component.enviar();

    expect(component.cargando()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('en error, expone el mensaje del backend', () => {
    component.form.setValue({ email: 'admin@pharmadash.com', password: 'incorrecta' });
    authService.login.mockReturnValue(throwError(() => ({ error: { message: 'Credenciales inválidas' } })));

    component.enviar();

    expect(component.cargando()).toBe(false);
    expect(component.errorMensaje()).toBe('Credenciales inválidas');
  });

  it('en error sin mensaje del backend, usa un mensaje genérico', () => {
    component.form.setValue({ email: 'admin@pharmadash.com', password: 'incorrecta' });
    authService.login.mockReturnValue(throwError(() => ({})));

    component.enviar();

    expect(component.errorMensaje()).toBe('No se pudo iniciar sesión');
  });
});
