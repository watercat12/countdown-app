// Parse a duration string into total seconds.
// Supports two formats:
//   Shorthand: "2m30s", "30s", "1h20s" — digit+unit pairs, combinable in any order
//   Dot-notation: ".45", "5.30", "1.20.30" — .ss / mm.ss / hh.mm.ss
export const MAX_SECONDS = 99 * 3600 + 59 * 60 + 59; // 99:59:59

function parseDotNotation(input: string): number | null {
  // .ss — seconds only
  if (input.startsWith(".")) {
    const sec = Number(input.slice(1));
    if (!Number.isInteger(sec) || sec < 0 || sec > 59) return null;
    return sec > 0 ? sec : null;
  }

  const parts = input.split(".");

  if (parts.length === 2) {
    // mm.ss
    const [minStr, secStr] = parts;
    if (minStr === "" || secStr === "") return null;
    const min = Number(minStr);
    const sec = Number(secStr);
    if (!Number.isInteger(min) || !Number.isInteger(sec)) return null;
    if (min < 0 || min > 59 || sec < 0 || sec > 59) return null;
    const total = min * 60 + sec;
    return total > 0 ? total : null;
  }

  if (parts.length === 3) {
    // hh.mm.ss
    const [hrStr, minStr, secStr] = parts;
    if (hrStr === "" || minStr === "" || secStr === "") return null;
    const hr = Number(hrStr);
    const min = Number(minStr);
    const sec = Number(secStr);
    if (!Number.isInteger(hr) || !Number.isInteger(min) || !Number.isInteger(sec)) return null;
    if (hr < 0 || hr > 99 || min < 0 || min > 59 || sec < 0 || sec > 59) return null;
    const total = hr * 3600 + min * 60 + sec;
    return total > 0 ? total : null;
  }

  return null;
}

function parseShorthand(input: string): number | null {
  if (!/^(\d+[hms])+$/.test(input)) return null;

  let total = 0;
  const re = /(\d+)([hms])/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(input)) !== null) {
    const value = Number(match[1]);
    const unit = match[2];
    total += unit === "h" ? value * 3600 : unit === "m" ? value * 60 : value;
  }

  return total > 0 ? total : null;
}

export function parseDuration(input: string): number | null {
  const text = input.trim();
  if (text === "") return null;

  const result = text.includes(".") ? parseDotNotation(text) : parseShorthand(text);
  if (result === null || result > MAX_SECONDS) return null;
  return result;
}
