# Active Context MCP

[GitHub repository](https://github.com/yuichisuzuki0601/active-context-mcp)

## Description

A VS Code extension that provides the currently open file, cursor position, and selection in VS Code to MCP-compatible AI tools.

## Setup

Install the VS Code extension first. Then add the MCP command to your MCP-compatible AI tool.

For tools that use an `mcpServers` config format, add this entry:

```json
{
  "mcpServers": {
    "active_context": {
      "command": "npx",
      "args": ["-y", "active-context-mcp"]
    }
  }
}
```

Some tools store this in a global MCP config file, some store it in a per-project config, and some expose it through a settings UI. The important values are:

```text
command: npx
args: -y active-context-mcp
```

## MCP Tool

The MCP command exposes one tool:

```text
get_active_context
```

It returns the current VS Code active editor context:

```json
{
  "schema": "active-context-mcp/v1",
  "workspace": "/path/to/workspace",
  "file": "/path/to/workspace/src/example.ts",
  "relativeFile": "src/example.ts",
  "cursor": {
    "line": 10,
    "character": 5
  },
  "activeLineText": "const value = example();",
  "selection": {
    "startLine": 10,
    "startCharacter": 5,
    "endLine": 10,
    "endCharacter": 5
  },
  "updatedAt": "2026-07-07T10:00:00.000Z"
}
```

## How It Works

- The VS Code extension writes the current editor state (file, cursor, selection) to a temporary file whenever it changes.
  - File: `os.tmpdir()/active-context-mcp/active-context.json`
- The MCP server reads that file and returns the content when the AI tool calls `get_active_context`.

## Requirements

- VS Code is running with this extension installed.
- Node.js and `npx` are available to the MCP client.
- The MCP client runs on the same machine as VS Code.

## When It Updates

- After VS Code starts
- When the active editor changes
- When the selection changes
- When workspace folders change

---

[GitHub リポジトリ](https://github.com/yuichisuzuki0601/active-context-mcp)

## 機能説明

現在 VS Code で開いているファイル、カーソルの位置、選択範囲を MCP 対応 AI ツールに提供する VS Code 拡張機能です。

## 設定

先に VS Code 拡張機能をインストールしてください。そのあと、MCP 対応 AI ツールに MCP command を追加します。

`mcpServers` 形式の設定を使うツールでは、次の entry を追加します。

```json
{
  "mcpServers": {
    "active_context": {
      "command": "npx",
      "args": ["-y", "active-context-mcp"]
    }
  }
}
```

設定場所はツールによって違います。グローバル MCP 設定ファイル、プロジェクト設定ファイル、設定 UI のどれかです。重要なのは次の値です。

```text
command: npx
args: -y active-context-mcp
```

## MCP ツール

MCP command は次のツールを提供します。

```text
get_active_context
```

返す内容は次のとおりです。

```json
{
  "schema": "active-context-mcp/v1",
  "workspace": "/path/to/workspace",
  "file": "/path/to/workspace/src/example.ts",
  "relativeFile": "src/example.ts",
  "cursor": {
    "line": 10,
    "character": 5
  },
  "activeLineText": "const value = example();",
  "selection": {
    "startLine": 10,
    "startCharacter": 5,
    "endLine": 10,
    "endCharacter": 5
  },
  "updatedAt": "2026-07-07T10:00:00.000Z"
}
```

## 仕組み

- VS Code 拡張機能が、エディタの状態（ファイル、カーソル、選択範囲）を変更のたびに一時ファイルに書き出します。
  - ファイル: `os.tmpdir()/active-context-mcp/active-context.json`
- AI ツールが `get_active_context` を呼ぶと、MCP サーバーがそのファイルを読んで返します。

## 必要なもの

- VS Code が起動していて、この拡張機能がインストールされていること。
- MCP クライアントから Node.js と `npx` を実行できること。
- MCP クライアントと VS Code が同じマシン上で動いていること。

## 更新タイミング

- VS Code 起動後
- アクティブエディタ変更時
- 選択範囲変更時
- ワークスペースフォルダ変更時
