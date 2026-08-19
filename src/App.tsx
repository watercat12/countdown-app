import { invoke } from "@tauri-apps/api/core";
import { useCountdown } from "./hooks/useCountdown";
import TimeDisplay from "./components/TimeDisplay";
import TimeInput from "./components/TimeInput";
import TimerControls from "./components/TimerControls";
import "./App.css";

function App() {
  const timer = useCountdown(async () => {
    // Fire the macOS notification + beep exactly once when the timer hits 0.
    try {
      await invoke("notify_timer_done");
    } catch (e) {
      console.error("notify_timer_done failed", e);
    }
  });

  return (
    <main className="container">
      <h1>Countdown</h1>
      <TimeDisplay seconds={timer.remaining} />
      <TimeInput disabled={timer.status === "running" || timer.status === "paused"} onSubmit={timer.setDuration} />
      <TimerControls
        status={timer.status}
        canStart={timer.duration > 0 && timer.remaining > 0}
        onStart={timer.start}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={timer.reset}
      />
    </main>
  );
}

export default App;
