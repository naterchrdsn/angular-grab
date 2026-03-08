# @nacho-labs/angular-grab-mcp

> MCP server for angular-grab — query grabbed elements from AI coding agents

This MCP (Model Context Protocol) server lets AI coding agents like Claude Desktop access your angular-grab history. It runs a single process that provides both:

- **MCP tools** over stdio for AI agent queries
- **HTTP webhook** on port 3456 to receive grabs from the browser

## Install

```bash
npm install -g @nacho-labs/angular-grab-mcp
```

Or run directly with npx:

```bash
npx @nacho-labs/angular-grab-mcp
```

## Configuration

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "angular-grab": {
      "command": "npx",
      "args": ["@nacho-labs/angular-grab-mcp"]
    }
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANGULAR_GRAB_HISTORY_PATH` | Path to angular-grab history file | `~/.angular-grab/history.json` |
| `ANGULAR_GRAB_PORT` | Webhook server port | `3456` |

## How It Works

1. **angular-grab** in the browser POSTs grabbed elements to the built-in webhook (`http://localhost:3456/grab`)
2. The server saves grabs to `~/.angular-grab/history.json`
3. **AI agents** query grab history via MCP tools over stdio

## MCP Tools

### `angular_grab_search`

Search angular-grab history by text, component name, or file path.

**Parameters:**
- `query` (optional): Search term (searches in HTML, component name, file path, selector)
- `componentName` (optional): Filter by component name (partial match)
- `filePath` (optional): Filter by file path (partial match)
- `limit` (optional): Maximum results (default: 10)

### `angular_grab_recent`

Get the most recent grabbed elements.

**Parameters:**
- `limit` (optional): Number of results (default: 5)

### `angular_grab_get`

Get a specific grabbed element by ID.

**Parameters:**
- `id` (required): The grab entry ID

### `angular_grab_stats`

Get statistics about your angular-grab history (total grabs, unique components, unique files, recent activity).

## Configuring angular-grab

Register a plugin that POSTs grabs to the webhook:

```typescript
import { Component, inject } from '@angular/core';
import { ANGULAR_GRAB_API } from '@nacho-labs/angular-grab/angular';

@Component({ /* ... */ })
export class AppComponent {
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
              componentStack: context.componentStack.map(c => ({
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
```

## Example Usage with Claude

Once configured, you can ask Claude:

- "Show me the last 5 elements I grabbed"
- "Search my angular-grab history for button components"
- "What components have I grabbed from the auth module?"

## License

MIT © Nate Richardson
