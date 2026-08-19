import type { TimerStatus } from "../hooks/useCountdown";

interface Props {
  status: TimerStatus;
  canStart: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export default function TimerControls({ status, canStart, onStart, onPause, onResume, onReset }: Props) {
  const primary =
    status === "running" ? (
      <button onClick={onPause}>Pause</button>
    ) : status === "paused" ? (
      <button onClick={onResume}>Resume</button>
    ) : (
      <button onClick={onStart} disabled={!canStart}>
        Start
      </button>
    );

  const canReset = status !== "idle";

  return (
    <div className="controls">
      {primary}
      <button onClick={onReset} disabled={!canReset}>
        Reset
      </button>
    </div>
  );
}
