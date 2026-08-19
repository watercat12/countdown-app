import { MAX_SECONDS } from "../lib/time";

function format(seconds: number): string {
  const clamped = Math.min(Math.max(0, seconds), MAX_SECONDS);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function TimeDisplay({ seconds }: { seconds: number }) {
  return <div className="time-display">{format(seconds)}</div>;
}
