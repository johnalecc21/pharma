import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

const PATHS: Record<string, string> = {
  grid: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z',
  box: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',
  cart: 'M3 3h2l.4 2M7 13h10l3-7H6.4M7 13L5.4 5H3M7 13l-1.2 4h11.4M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  alert: 'M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1 1 0 003 19.6h18a1 1 0 00.89-1.56L13.71 3.86a1 1 0 00-1.72 0z',
  clock: 'M12 8v4l3 3M12 22a10 10 0 100-20 10 10 0 000 20z',
  cash: 'M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6',
  search: 'M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z',
  plus: 'M12 5v14M5 12h14',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z',
  chart: 'M3 3v18h18M7 16l4-6 4 3 5-8',
  close: 'M18 6L6 18M6 6l12 12',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path [attr.d]="path" />
    </svg>
  `,
})
export class IconComponent {
  @Input() name = 'grid';
  @Input() size = 20;

  get path(): string {
    return PATHS[this.name] ?? PATHS['grid'];
  }
}
