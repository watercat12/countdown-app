// Parse a shorthand duration string like "2m30s", "30s", "1h20s" into total
// seconds. Units: h (hours), m (minutes), s (seconds), combinable in any order.
export const MAX_SECONDS = 99 * 3600 + 59 * 60 + 59; // 99:59:59

export function parseDuration(input: string): number | null {
  const text = input.trim();
  if (text === "") return null;

  // Must consist only of digit+unit pairs, nothing else.
  if (!/^(\d+[hms])+$/.test(text)) return null;

  let total = 0;
  const re = /(\d+)([hms])/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const value = Number(match[1]);
    const unit = match[2];
    total += unit === "h" ? value * 3600 : unit === "m" ? value * 60 : value;
  }

  if (total <= 0 || total > MAX_SECONDS) return null;
  return total;
}
