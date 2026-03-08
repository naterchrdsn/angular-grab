import { Component, inject } from '@angular/core';
import { ANGULAR_GRAB_API } from '@nacho-labs/angular-grab/angular';
import { HeaderComponent } from './header/header.component';
import { CardComponent } from './card/card.component';
import { PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, CardComponent, PopoverComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor() {
    const api = inject(ANGULAR_GRAB_API);
    api.registerPlugin({
      name: 'webhook',
      hooks: {
        onCopySuccess: (snippet, context) => {
          fetch('http://localhost:3456/grab', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              html: context.html,
              componentName: context.componentName,
              filePath: context.filePath,
              line: context.line,
              column: context.column,
              selector: context.selector,
              cssClasses: context.cssClasses,
              snippet,
              componentStack: context.componentStack.map((c) => ({
                name: c.name,
                filePath: c.filePath,
                line: c.line,
                column: c.column,
              })),
            }),
          }).catch(() => {});
        },
      },
    });
  }
}
