// The letter each choice is called by.
//
// Lettering options by POSITION — A, B, C down the list — is right when the
// paper letters them the same way, and wrong whenever it does not: the
// extraction prompt stores the paper's own letter as the option id, and a
// matching run often letters by initial ("write E for Emma, M for Mark"). Shown as
// A and B, the buttons disagree with the instruction the student is reading, and
// when the labels are the bare letters themselves nothing on the page maps one to
// the other at all.
//
// So the ids ARE the letters whenever they can be: every id a single letter, and
// no two alike. Anything else — an `opt-3` from an option added by hand, ids that
// repeat — letters the whole list by position instead, since a mix of the two
// would print "A, B, E".
export function optionLetters(options: Array<{ id: string }>): string[] {
  const ids = options.map((option) => option.id.trim().toUpperCase());
  const printed =
    ids.every((id) => /^[A-Z]$/.test(id)) && new Set(ids).size === ids.length;
  return printed
    ? ids
    : options.map((_, index) => String.fromCharCode(65 + index));
}
