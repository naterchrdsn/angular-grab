import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button class="btn" type="button">{{ label }}</button>
  `,
  styles: [`
    .btn {
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn:hover { background: #2563eb; }
  `],
})
export class ButtonComponent {
  @Input() label = 'Click me';
}
