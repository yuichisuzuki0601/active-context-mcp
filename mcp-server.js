#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const STATE_FILE = path.join(os.tmpdir(), 'active-context-mcp', 'active-context.json');

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (_) {
    return null;
  }
}

function getActiveContext() {
  const state = readState();
  if (state) {
    return state;
  }

  throw new Error('No running Active Context MCP VS Code extension was found. Open VS Code with the extension enabled.');
}

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function success(id, result) {
  writeMessage({ jsonrpc: '2.0', id, result });
}

function failure(id, code, message) {
  writeMessage({ jsonrpc: '2.0', id, error: { code, message } });
}

async function handleRequest(message) {
  if (!Object.prototype.hasOwnProperty.call(message, 'id')) {
    return;
  }

  try {
    if (message.method === 'initialize') {
      success(message.id, {
        protocolVersion: message.params?.protocolVersion || '2025-06-18',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: 'active-context-mcp',
          version: '1.0.0',
        },
      });
      return;
    }

    if (message.method === 'ping') {
      success(message.id, {});
      return;
    }

    if (message.method === 'tools/list') {
      success(message.id, {
        tools: [
          {
            name: 'get',
            description: 'Get the current VS Code active editor, cursor, and selection context.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
          },
        ],
      });
      return;
    }

    if (message.method === 'tools/call') {
      const toolName = message.params?.name;
      if (toolName !== 'get') {
        failure(message.id, -32602, `Unknown tool: ${toolName}`);
        return;
      }

      const context = await getActiveContext();
      success(message.id, {
        content: [
          {
            type: 'text',
            text: JSON.stringify(context, null, 2),
          },
        ],
      });
      return;
    }

    failure(message.id, -32601, `Method not found: ${message.method}`);
  } catch (error) {
    failure(message.id, -32000, error.message || String(error));
  }
}

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  if (!line.trim()) {
    return;
  }

  try {
    handleRequest(JSON.parse(line));
  } catch (error) {
    failure(null, -32700, error.message || String(error));
  }
});
