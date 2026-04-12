import {
  SELECTION_END_MACROS,
  SELECTION_START_MACROS,
} from "./constants";
import { UserContentSelection } from "./user-content-selection/user-content-selection";

const INTERNAL_SYSTEM_PROMPT_CARET =
  "You are an editor assistant for Obsidian. Apply the instruction in the user prompt to the user content. Output only the result. No prefaces, no explanations, no quotes, no code fences. Use Obsidian Markdown formatting. Match the document's voice and style unless the instruction specifies otherwise.";

const INTERNAL_SYSTEM_PROMPT_SELECTION =
  `You are an editor assistant for Obsidian. The exact span between "${SELECTION_START_MACROS}" and "${SELECTION_END_MACROS}" is your target. Apply the instruction in the user prompt to that span. Output only the result. No markers, no prefaces, no explanations, no quotes, no code fences. Use Obsidian Markdown formatting. Match the document's voice and style unless the instruction specifies otherwise.`;

export function getInternalSystemPrompt({
  userContentSelection,
}: {
  userContentSelection: UserContentSelection;
}): string {
  return userContentSelection.isEmpty()
    ? INTERNAL_SYSTEM_PROMPT_CARET
    : INTERNAL_SYSTEM_PROMPT_SELECTION;
}
