import { EditorPosition } from "obsidian";

export type AutoSelectionMode = "line" | "paragraph" | "file";

export type AutoSelectionResult = {
  mode: AutoSelectionMode;
  contextText: string;
  insertPosition: EditorPosition;
  insertPrefix: string;
};

/**
 * When no text is selected, determines what context to send to the LLM and
 * where to insert its response, based on the cursor's surroundings:
 *
 * - line:      cursor is mid-line (ch > 0) or on the first line.
 *              Context = the current line. Insert after end of that line.
 *
 * - paragraph: cursor is at the start of a line (ch === 0) and the line
 *              directly above is non-blank (i.e. the user placed the cursor
 *              immediately below a paragraph with no blank line separator).
 *              Context = the contiguous block of non-blank lines above.
 *              Insert after end of current line (the blank line below the para).
 *
 * - file:      cursor is at the start of a line (ch === 0) and the line
 *              directly above is blank (or cursor is isolated by blank lines).
 *              Context = entire file. Insert after end of current line,
 *              preceded by a markdown horizontal rule.
 */
export function resolveAutoSelection(
  text: string,
  cursor: EditorPosition,
): AutoSelectionResult {
  const lines = text.split("\n");
  const { line: cursorLine, ch: cursorCh } = cursor;

  let mode: AutoSelectionMode;
  if (cursorCh > 0 || cursorLine === 0) {
    mode = "line";
  } else {
    const prevLine = lines[cursorLine - 1] ?? "";
    mode = prevLine.trim() === "" ? "file" : "paragraph";
  }

  let contextText: string;
  if (mode === "line") {
    contextText = lines[cursorLine] ?? "";
  } else if (mode === "paragraph") {
    let start = cursorLine - 1;
    while (start > 0 && (lines[start - 1] ?? "").trim() !== "") {
      start--;
    }
    contextText = lines.slice(start, cursorLine).join("\n");
  } else {
    contextText = text;
  }

  const currentLineText = lines[cursorLine] ?? "";
  const insertPosition: EditorPosition = {
    line: cursorLine,
    ch: currentLineText.length,
  };

  const insertPrefix = mode === "file" ? "\n\n---\n\n" : "\n\n";

  return { mode, contextText, insertPosition, insertPrefix };
}
