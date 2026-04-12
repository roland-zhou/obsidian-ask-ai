# Ask AI

> **Note:** This is a fork of [chernodub/obsidian-llm-shortcut](https://github.com/chernodub/obsidian-llm-shortcut) with additional changes.

---

[![downloads shield](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22ask-ai%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://www.obsidianstats.com/plugins/ask-ai)

Turn Markdown prompt files into Obsidian commands.

`Ask AI` maps your prompt library folder to command palette entries, then runs the selected prompt against the active note using any OpenAI-compatible provider.

## Why this plugin

If you keep reusing prompts ("improve writing", "translate", "make this a bullet-list"), copy-paste gets tedious quickly.

This plugin lets you:

- keep prompts as plain `.md` files in your vault;
- organize them in folders;
- run them like native Obsidian commands.

<img width="100%" alt="Commands from prompts showcase" src="https://github.com/user-attachments/assets/06297261-dce1-493b-a117-5ac6103487af" />

![ezgif-376a9b52f4d3e831](https://github.com/user-attachments/assets/841b9192-7f40-4039-85eb-1ceef12d1366)


> I used OpenRouter's `google/gemini-3-flash-preview` for demo

## Prerequisites

You have to use your own LLM provider and keys :)

## Features

- Use your own OpenAI-compatible providers (OpenAI, OpenRouter, and others with compatible endpoints)
- Prompt files become commands automatically (including nested folders)
- Streaming output directly into the editor selection/cursor
- Custom prompt command for one-off prompts without creating a file
- Local-first behavior: your prompt files stay in your vault

## 2-minute quick start

1. Install `Ask AI` from Community Plugins.
2. Open plugin settings and fill:
   - `🔑 API key`
   - `🌐 Base URL` (example: `https://api.openai.com/v1`)
   - `🤖 Model name` (example: `gpt-4.1-mini`)
3. Create a prompt folder (default: `_prompts`).
4. Add a prompt file, for example `_prompts/Writing/Improve.md`:

```md
Improve the selected text.
Keep the original meaning, but make it clearer and more concise.
```

5. Open any note, then run the command:
   - `Ask AI: Writing / Improve`
   - Select text beforehand to target a specific passage, or just position your cursor and let the plugin decide what context to use (see [Context for LLM](#context-for-llm)).

> The better you are with the prompting, the better results you get, it's mostly on you :)

## Advanced prompt features

### `info-mode` popup

This feature is a “show result, don’t edit my note” mode. Normally, this plugin writes the AI response directly into your note (at cursor/selection).

If you set this in your prompt file frontmatter: `ask-ai-prompt-response-processing-mode: info` the response is shown in a popup window instead.

The popup opens with your prompt name as the title, shows a loading state, then streams in the AI answer live.

The answer is rendered as Markdown (so headings/lists/tables display nicely).

Your note content is not replaced in this mode.

Good use case: dictionary/explanation prompts (like prompt-examples/Foreign word explanation.md) where you want to read info quickly without changing the document.

### Selection-Only Commands

Some prompts work best when applied to a specific selection of text. You can mark a command as selection-only by adding frontmatter to your prompt file:

```yaml
---
ask-ai-selection-mode: selection-only
---
Your prompt content here...
```

When a command is marked as selection-only, it will:

- Require text to be selected before execution
- Show an error notification if you try to run it without a selection
- Only process the selected text (and the document context) when executed

This is useful for prompts that are designed to transform, analyze, or modify specific portions of text rather than working with the entire document.

<video width="350" alt="Demo Selection Only" src="https://github.com/user-attachments/assets/4eabe88a-d4c5-4928-b357-ad0928b7484b"></video>

### Context for LLM

When you **select text**, the plugin sends that selection as context and streams the response back in place.

When the **cursor is placed without a selection**, the plugin picks context automatically based on where the cursor is:

| Cursor position | Context sent to LLM | Response inserted |
|---|---|---|
| Mid-line, or on the first line | Current line only | After the current line (`\n\n`) |
| Start of a line directly below a paragraph | The preceding paragraph block | After the current line (`\n\n`) |
| Start of a line separated from content by blank lines | Entire file | After the current line, preceded by `\n\n---\n\n` |

This means you can point the cursor at a line to refine it, position right below a paragraph to continue or transform it, or place the cursor in open space to generate something from the full document.

#### Limiting context size

You can override how much of the file is included around the selection or cursor by adding these parameters to your prompt file's frontmatter:

```yaml
---
ask-ai-context-size-before: 256
ask-ai-context-size-after: 0
---
Your prompt content here...
```

- `ask-ai-context-size-before`: Number of characters to include before the selection (default: entire context)
- `ask-ai-context-size-after`: Number of characters to include after the selection (default: entire context)

## Built-in command: custom prompt

The plugin also adds a command for ad-hoc prompting (default label: `Custom prompt`).

You can rename this in settings via `📝 Command label`.

## Our use cases

- Improve clarity and grammar in selected paragraphs
- Translate selected text while preserving formatting
- Convert free text into a table
- Explain unfamiliar words in context
- Generate concise summaries/checklists from meeting notes

Ready-made examples are available in [`prompt-examples`](./prompt-examples).

## Integrations

- [OpenRouter setup example](./openrouter.ai.md)

## License

MIT
