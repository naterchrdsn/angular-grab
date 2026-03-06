import { Z_INDEX_POPOVER, TOOLBAR_POPOVER_OFFSET } from '../constants';

const POPOVER_ID = '__ag-comment-popover__';
const STYLE_ID = '__ag-comment-styles__';

export interface CommentPopover {
  show(): void;
  hide(): void;
  isVisible(): boolean;
  isPopoverElement(el: Element): boolean;
  dispose(): void;
}

export interface CommentPopoverCallbacks {
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

export function createCommentPopover(callbacks: CommentPopoverCallbacks): CommentPopover {
  let popover: HTMLDivElement | null = null;
  let textarea: HTMLTextAreaElement | null = null;
  let visible = false;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  function injectStyles(): void {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${POPOVER_ID} {
        position: fixed;
        bottom: ${TOOLBAR_POPOVER_OFFSET};
        left: 50%;
        transform: translateX(-50%);
        z-index: ${Z_INDEX_POPOVER};
        background: var(--ag-popover-bg, #0f172a);
        border: 1px solid var(--ag-popover-border, #1e293b);
        border-radius: 12px;
        box-shadow: 0 8px 24px var(--ag-popover-shadow, rgba(0, 0, 0, 0.5));
        width: 340px;
        padding: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.15s ease, visibility 0.15s ease;
        pointer-events: auto;
      }
      #${POPOVER_ID}.ag-comment-visible {
        opacity: 1;
        visibility: visible;
      }
      #${POPOVER_ID} textarea {
        width: 100%;
        min-height: 80px;
        padding: 8px 10px;
        border: 1px solid var(--ag-popover-border, #1e293b);
        border-radius: 8px;
        background: var(--ag-surface, #1e293b);
        color: var(--ag-popover-text, #e2e8f0);
        font: 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        resize: vertical;
        outline: none;
        box-sizing: border-box;
      }
      #${POPOVER_ID} textarea:focus {
        border-color: var(--ag-accent, #3b82f6);
      }
      #${POPOVER_ID} textarea::placeholder {
        color: var(--ag-text-muted, #64748b);
      }
      #${POPOVER_ID} .ag-comment-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 10px;
      }
      #${POPOVER_ID} .ag-comment-btn {
        padding: 6px 14px;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      #${POPOVER_ID} .ag-comment-cancel {
        background: transparent;
        color: var(--ag-text-muted, #64748b);
      }
      #${POPOVER_ID} .ag-comment-cancel:hover {
        background: var(--ag-popover-hover, #1e293b);
        color: var(--ag-popover-text, #e2e8f0);
      }
      #${POPOVER_ID} .ag-comment-submit {
        background: var(--ag-accent, #3b82f6);
        color: #fff;
      }
      #${POPOVER_ID} .ag-comment-submit:hover {
        background: var(--ag-accent-hover, #2563eb);
      }
    `;
    document.head.appendChild(style);
  }

  function ensurePopover(): HTMLDivElement {
    if (popover) return popover;

    injectStyles();

    popover = document.createElement('div');
    popover.id = POPOVER_ID;
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-label', 'Add comment');

    textarea = document.createElement('textarea');
    textarea.placeholder = 'Add a comment...';
    textarea.rows = 3;

    const footer = document.createElement('div');
    footer.className = 'ag-comment-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'ag-comment-btn ag-comment-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      doHide();
      callbacks.onCancel();
    });

    const submitBtn = document.createElement('button');
    submitBtn.className = 'ag-comment-btn ag-comment-submit';
    submitBtn.textContent = 'Copy with Comment';
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const comment = textarea!.value.trim();
      if (comment) {
        doHide();
        callbacks.onSubmit(comment);
      } else {
        textarea!.style.borderColor = 'var(--ag-accent, #3b82f6)';
        textarea!.setAttribute('placeholder', 'Please enter a comment...');
        textarea!.focus();
        setTimeout(() => {
          if (textarea) {
            textarea.style.borderColor = '';
            textarea.setAttribute('placeholder', 'Add a comment...');
          }
        }, 2000);
      }
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(submitBtn);
    popover.appendChild(textarea);
    popover.appendChild(footer);

    document.body.appendChild(popover);
    return popover;
  }

  function attachKeydownInterceptor(): void {
    if (keydownHandler) return;

    keydownHandler = (e: KeyboardEvent) => {
      // When textarea is focused, prevent keyboard handler from intercepting
      if (textarea && document.activeElement === textarea) {
        e.stopImmediatePropagation();

        if (e.key === 'Escape') {
          doHide();
          callbacks.onCancel();
        }
      }
    };

    document.addEventListener('keydown', keydownHandler, true);
  }

  function detachKeydownInterceptor(): void {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler, true);
      keydownHandler = null;
    }
  }

  function doHide(): void {
    visible = false;
    popover?.classList.remove('ag-comment-visible');
    detachKeydownInterceptor();
  }

  return {
    show(): void {
      const el = ensurePopover();
      textarea!.value = '';
      visible = true;
      void el.offsetHeight;
      el.classList.add('ag-comment-visible');
      attachKeydownInterceptor();
      // Focus after transition starts
      requestAnimationFrame(() => textarea?.focus());
    },

    hide(): void {
      doHide();
    },

    isVisible(): boolean {
      return visible;
    },

    isPopoverElement(el: Element): boolean {
      if (!popover) return false;
      let current: Element | null = el;
      while (current) {
        if (current === popover || current.id === POPOVER_ID) return true;
        current = current.parentElement;
      }
      return false;
    },

    dispose(): void {
      detachKeydownInterceptor();
      popover?.remove();
      document.getElementById(STYLE_ID)?.remove();
      popover = null;
      textarea = null;
      visible = false;
    },
  };
}
