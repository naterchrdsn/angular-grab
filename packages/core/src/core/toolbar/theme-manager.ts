import type { ThemeMode, Theme } from '../types';

const STYLE_ID = '__ag-theme-vars__';
const OVERRIDE_STYLE_ID = '__ag-theme-overrides__';

const DARK_VARS = `
  :root {
    --ag-bg: #0f172a;
    --ag-text: #e2e8f0;
    --ag-text-muted: #64748b;
    --ag-accent: #3b82f6;
    --ag-accent-hover: #2563eb;
    --ag-surface: #1e293b;
    --ag-border: #334155;
    --ag-overlay-border: #3b82f6;
    --ag-overlay-bg: rgba(59, 130, 246, 0.1);
    --ag-label-bg: #3b82f6;
    --ag-label-text: #fff;
    --ag-toast-bg: #0f172a;
    --ag-toast-text: #e2e8f0;
    --ag-toast-title: #fff;
    --ag-toast-label: #64748b;
    --ag-toast-shadow: rgba(0, 0, 0, 0.4);
    --ag-toolbar-bg: #0f172a;
    --ag-toolbar-text: #94a3b8;
    --ag-toolbar-hover: #1e293b;
    --ag-toolbar-active: #3b82f6;
    --ag-toolbar-border: #1e293b;
    --ag-toolbar-shadow: rgba(0, 0, 0, 0.5);
    --ag-popover-bg: #0f172a;
    --ag-popover-text: #e2e8f0;
    --ag-popover-border: #1e293b;
    --ag-popover-hover: #1e293b;
    --ag-popover-shadow: rgba(0, 0, 0, 0.5);
  }
`;

const LIGHT_VARS = `
  :root {
    --ag-bg: #ffffff;
    --ag-text: #334155;
    --ag-text-muted: #94a3b8;
    --ag-accent: #2563eb;
    --ag-accent-hover: #1d4ed8;
    --ag-surface: #f1f5f9;
    --ag-border: #e2e8f0;
    --ag-overlay-border: #2563eb;
    --ag-overlay-bg: rgba(37, 99, 235, 0.08);
    --ag-label-bg: #2563eb;
    --ag-label-text: #fff;
    --ag-toast-bg: #ffffff;
    --ag-toast-text: #334155;
    --ag-toast-title: #0f172a;
    --ag-toast-label: #94a3b8;
    --ag-toast-shadow: rgba(0, 0, 0, 0.12);
    --ag-toolbar-bg: #ffffff;
    --ag-toolbar-text: #64748b;
    --ag-toolbar-hover: #f1f5f9;
    --ag-toolbar-active: #2563eb;
    --ag-toolbar-border: #e2e8f0;
    --ag-toolbar-shadow: rgba(0, 0, 0, 0.12);
    --ag-popover-bg: #ffffff;
    --ag-popover-text: #334155;
    --ag-popover-border: #e2e8f0;
    --ag-popover-hover: #f1f5f9;
    --ag-popover-shadow: rgba(0, 0, 0, 0.12);
  }
`;

/** Maps Theme interface fields to CSS variable names. */
const THEME_TO_VAR: Record<keyof Theme, string> = {
  overlayBorderColor: '--ag-overlay-border',
  overlayBgColor: '--ag-overlay-bg',
  labelBgColor: '--ag-label-bg',
  labelTextColor: '--ag-label-text',
  toastBgColor: '--ag-toast-bg',
  toastTextColor: '--ag-toast-text',
  toolbarBgColor: '--ag-toolbar-bg',
  toolbarTextColor: '--ag-toolbar-text',
  toolbarAccentColor: '--ag-toolbar-active',
  popoverBgColor: '--ag-popover-bg',
  popoverTextColor: '--ag-popover-text',
  popoverBorderColor: '--ag-popover-border',
};

export interface ThemeManager {
  apply(mode: ThemeMode): void;
  applyOverrides(theme: Partial<Theme>): void;
  clearOverrides(): void;
  dispose(): void;
}

export function createThemeManager(): ThemeManager {
  let styleEl: HTMLStyleElement | null = null;
  let overrideEl: HTMLStyleElement | null = null;
  let currentMode: ThemeMode = 'dark';
  let mediaQuery: MediaQueryList | null = null;
  let mediaHandler: ((e: MediaQueryListEvent) => void) | null = null;

  function getOrCreateStyle(): HTMLStyleElement {
    if (styleEl) return styleEl;

    const existing = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (existing) {
      styleEl = existing;
      return styleEl;
    }

    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
    return styleEl;
  }

  function getOrCreateOverrideStyle(): HTMLStyleElement {
    if (overrideEl) return overrideEl;

    overrideEl = document.createElement('style');
    overrideEl.id = OVERRIDE_STYLE_ID;
    document.head.appendChild(overrideEl);
    return overrideEl;
  }

  function resolveMode(mode: ThemeMode): 'dark' | 'light' {
    if (mode !== 'system') return mode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyResolved(resolved: 'dark' | 'light'): void {
    const el = getOrCreateStyle();
    el.textContent = resolved === 'dark' ? DARK_VARS : LIGHT_VARS;
  }

  function detachMediaListener(): void {
    if (mediaQuery && mediaHandler) {
      mediaQuery.removeEventListener('change', mediaHandler);
    }
    mediaQuery = null;
    mediaHandler = null;
  }

  return {
    apply(mode: ThemeMode): void {
      currentMode = mode;
      detachMediaListener();

      applyResolved(resolveMode(mode));

      if (mode === 'system') {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaHandler = () => applyResolved(resolveMode('system'));
        mediaQuery.addEventListener('change', mediaHandler);
      }
    },

    applyOverrides(theme: Partial<Theme>): void {
      const vars: string[] = [];
      for (const [key, varName] of Object.entries(THEME_TO_VAR)) {
        const value = theme[key as keyof Theme];
        if (value) {
          vars.push(`    ${varName}: ${value};`);
        }
      }

      if (vars.length === 0) {
        this.clearOverrides();
        return;
      }

      const el = getOrCreateOverrideStyle();
      el.textContent = `  :root {\n${vars.join('\n')}\n  }`;
    },

    clearOverrides(): void {
      overrideEl?.remove();
      document.getElementById(OVERRIDE_STYLE_ID)?.remove();
      overrideEl = null;
    },

    dispose(): void {
      detachMediaListener();
      styleEl?.remove();
      document.getElementById(STYLE_ID)?.remove();
      styleEl = null;
      this.clearOverrides();
    },
  };
}
