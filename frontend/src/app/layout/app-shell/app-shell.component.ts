import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  readonly sidebarAbierto = signal(true);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid' },
    { label: 'Inventario', path: '/inventario', icon: 'box' },
    { label: 'Venta rápida', path: '/ventas', icon: 'cart' },
  ];

  constructor(readonly authService: AuthService) {}

  alternarSidebar(): void {
    this.sidebarAbierto.set(!this.sidebarAbierto());
  }
}
