// Spread onto every box a student writes an answer in, and the notes pad.
//
// On an English paper the browser's own help gives answers away. A red squiggle
// under a misspelt word marks a wrong word-formation answer, autocorrect fixes
// it outright, and Grammarly or LanguageTool rewrite a sentence for you. Chrome
// also autofills a box from what was last typed into a field like it, which on a
// shared classroom PC is the previous student's answer. Chrome's "Help me write"
// and Edge's Copilot drafts are offered from the same boxes.
//
// Each attribute turns off one of these. They are hints, so an extension can
// ignore them, but the ones listed are honoured by the browsers and tools our
// students actually use.
export const EXAM_FIELD_PROPS = {
  spellCheck: false,
  autoComplete: "off",
  autoCorrect: "off",
  autoCapitalize: "off",
  writingsuggestions: "false",
  "data-gramm": "false",
  "data-gramm_editor": "false",
  "data-enable-grammarly": "false",
  "data-lt-active": "false",
} as const;
