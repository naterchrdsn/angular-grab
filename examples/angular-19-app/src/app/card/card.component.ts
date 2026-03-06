import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <h2 class="card-title">{{ title }}</h2>
      <p class="card-body">{{ body }}</p>
      <div class="card-footer">
        <app-button [label]="'Learn More'" />
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .card-title { font-size: 1.1rem; font-weight: 600; margin: 0 0 8px; }
    .card-body { color: #64748b; margin: 0 0 16px; line-height: 1.5; }
    .card-footer { display: flex; justify-content: flex-end; }
  `],
  imports: [ButtonComponent],
})
export class CardComponent {
  @Input() title = '';
  @Input() body = '';
}
