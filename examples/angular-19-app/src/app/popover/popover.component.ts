import { Component } from '@angular/core';

@Component({
  selector: 'app-popover',
  standalone: true,
  template: `
    <div class="popover-demo">
      <h3 class="popover-heading">Freeze Mode Test</h3>
      <p class="popover-desc">These elements disappear on mouse-out. Use freeze mode (<kbd>F</kbd>) to grab them.</p>

      <div class="popover-row">
        <div class="popover-trigger">
          Hover for tooltip
          <div class="popover-tooltip tooltip-style">
            <strong>Tooltip content</strong>
            <p>This disappears when you move your mouse away. Freeze the page first!</p>
          </div>
        </div>

        <div class="dropdown-trigger">
          Hover for dropdown ▾
          <ul class="dropdown-menu dropdown-style">
            <li class="dropdown-item">Dashboard</li>
            <li class="dropdown-item">Settings</li>
            <li class="dropdown-item">Profile</li>
            <li class="dropdown-item highlighted">Sign out</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .popover-demo {
      margin-top: 40px;
      padding: 24px;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      background: #f8fafc;
    }
    .popover-heading { font-size: 1.1rem; font-weight: 600; margin: 0 0 8px; }
    .popover-desc { color: #64748b; margin: 0 0 20px; line-height: 1.5; }
    .popover-desc kbd {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 2px 6px;
      font-family: monospace;
      font-size: 0.9rem;
    }
    .popover-row {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    /* Tooltip */
    .popover-trigger {
      position: relative;
      padding: 10px 16px;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      cursor: default;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .popover-tooltip {
      display: none;
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: #e2e8f0;
      padding: 12px 16px;
      border-radius: 8px;
      width: 220px;
      font-size: 0.8rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10;
    }
    .popover-tooltip strong { color: white; }
    .popover-tooltip p { margin: 6px 0 0; line-height: 1.4; }
    .popover-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #1e293b;
    }
    .popover-trigger:hover .popover-tooltip { display: block; }

    /* Dropdown */
    .dropdown-trigger {
      position: relative;
      padding: 10px 16px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: default;
      font-size: 0.875rem;
      font-weight: 500;
      color: #334155;
    }
    .dropdown-menu {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      list-style: none;
      margin: 0;
      padding: 4px 0;
      min-width: 160px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 10;
    }
    .dropdown-item {
      padding: 8px 14px;
      font-size: 0.85rem;
      color: #334155;
      cursor: pointer;
    }
    .dropdown-item:hover { background: #f1f5f9; }
    .dropdown-item.highlighted { color: #ef4444; }
    .dropdown-trigger:hover .dropdown-menu { display: block; }
  `],
})
export class PopoverComponent {}
