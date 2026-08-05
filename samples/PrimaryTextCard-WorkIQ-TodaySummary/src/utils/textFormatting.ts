// Work IQ chat responses are Markdown-ish and use pseudo-XML entity tags
// (<Person>, <Event>, <File>) plus footnote markers like [^1^] — see the
// response examples in the Work IQ REST API reference. The Primary Text Card
// view renders plain text, so strip that formatting down for the headline.
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/<\/?[A-Za-z]+>/g, '')
    .replace(/\[\^\d+\^\]/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}…`;
}
