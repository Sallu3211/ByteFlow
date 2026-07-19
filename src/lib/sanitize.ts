// Strips HTML tags from user-entered text. Facebook comments/DMs render as
// plain text, so a stray "<b>" or pasted markup would show up literally and
// read as broken/spammy — this keeps everything (including emoji) as plain
// text while dropping anything that looks like a tag.
export function sanitizeText(input: string) {
  return input.replace(/<[^>]*>/g, '').trim()
}
