# AgenticApps MCP Server

This repository now contains a minimal stdio MCP server implemented in Node.js with no external dependencies.

## Tools

- `echo`: returns text for connection testing
- `workspace_summary`: lists top-level files and directories for the current workspace
- `package_scripts`: reads `package.json` scripts from a project path relative to the workspace root

## Run locally

```bash
npm start
```

## MCP config example

Use the `.mcp.json` file in the workspace root or point your MCP client at:

```json
{
  "mcpServers": {
    "agenticapps": {
      "command": "node",
      "args": [
        "/Users/ananya/Documents/React Prep/AgenticApps/src/index.js"
      ],
      "cwd": "/Users/ananya/Documents/React Prep"
    }
  }
}
```
