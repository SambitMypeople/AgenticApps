import fs from "fs";
import path from "path";

const SERVER_INFO = {
  name: "agenticapps",
  version: "0.1.0"
};

const WORKSPACE_ROOT = process.cwd();

const tools = [
  {
    name: "echo",
    description: "Return the provided text. Useful for connection checks.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to echo back."
        }
      },
      required: ["text"],
      additionalProperties: false
    }
  },
  {
    name: "workspace_summary",
    description: "Summarize the current workspace by listing top-level directories and files.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "package_scripts",
    description: "Read package.json scripts from a project relative to the workspace root.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Relative path to a folder containing package.json."
        }
      },
      required: ["projectPath"],
      additionalProperties: false
    }
  }
];

let inputBuffer = Buffer.alloc(0);

function sendMessage(message) {
  const json = JSON.stringify(message);
  const payload = `Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`;
  process.stdout.write(payload);
}

function sendResponse(id, result) {
  sendMessage({
    jsonrpc: "2.0",
    id,
    result
  });
}

function sendError(id, code, message) {
  sendMessage({
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message
    }
  });
}

function toTextResult(text) {
  return {
    content: [
      {
        type: "text",
        text
      }
    ]
  };
}

function safeResolve(relativePath) {
  const resolved = path.resolve(WORKSPACE_ROOT, relativePath);
  if (!resolved.startsWith(WORKSPACE_ROOT)) {
    throw new Error("Path must stay within the workspace root.");
  }
  return resolved;
}

function handleInitialize(id) {
  sendResponse(id, {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {}
    },
    serverInfo: SERVER_INFO
  });
}

function handleToolsList(id) {
  sendResponse(id, { tools });
}

function handleToolCall(id, params) {
  const name = params?.name;
  const args = params?.arguments ?? {};

  try {
    if (name === "echo") {
      sendResponse(id, toTextResult(String(args.text ?? "")));
      return;
    }

    if (name === "workspace_summary") {
      const entries = fs.readdirSync(WORKSPACE_ROOT, { withFileTypes: true })
        .map((entry) => `${entry.isDirectory() ? "dir" : "file"} ${entry.name}`)
        .sort();
      sendResponse(id, toTextResult(entries.join("\n")));
      return;
    }

    if (name === "package_scripts") {
      const projectRoot = safeResolve(args.projectPath);
      const packageJsonPath = path.join(projectRoot, "package.json");
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`No package.json found at ${args.projectPath}`);
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const scripts = packageJson.scripts ?? {};
      sendResponse(id, toTextResult(JSON.stringify(scripts, null, 2)));
      return;
    }

    sendError(id, -32601, `Unknown tool: ${name}`);
  } catch (error) {
    sendError(id, -32000, error.message);
  }
}

function handleRequest(message) {
  const { id, method, params } = message;

  if (method === "initialize") {
    handleInitialize(id);
    return;
  }

  if (method === "notifications/initialized") {
    return;
  }

  if (method === "tools/list") {
    handleToolsList(id);
    return;
  }

  if (method === "tools/call") {
    handleToolCall(id, params);
    return;
  }

  if (id !== undefined) {
    sendError(id, -32601, `Method not found: ${method}`);
  }
}

function readMessages(chunk) {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);

  while (true) {
    const headerEnd = inputBuffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      return;
    }

    const headerText = inputBuffer.slice(0, headerEnd).toString("utf8");
    const match = headerText.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      throw new Error("Missing Content-Length header.");
    }

    const contentLength = Number(match[1]);
    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + contentLength;
    if (inputBuffer.length < messageEnd) {
      return;
    }

    const rawMessage = inputBuffer.slice(messageStart, messageEnd).toString("utf8");
    inputBuffer = inputBuffer.slice(messageEnd);
    const message = JSON.parse(rawMessage);
    handleRequest(message);
  }
}

process.stdin.on("data", readMessages);
process.stdin.on("error", (error) => {
  fs.writeSync(process.stderr.fd, `${error.message}\n`);
});
