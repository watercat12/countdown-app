import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { requestPermission } from "@tauri-apps/plugin-notification";
import { useCountdown } from "./hooks/useCountdown";
import TimeDisplay from "./components/TimeDisplay";
import TimeInput from "./components/TimeInput";
import "./App.css";

function App() {
  useEffect(() => {
    requestPermission();
  }, []);

  const timer = useCountdown(async () => {
    try {
      await invoke("notify_timer_done");
    } catch (e) {
      console.error("notify_timer_done failed", e);
    }
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && timer.status !== "idle") {
        timer.reset();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [timer.status, timer.reset]);

  return (
    <main className="container">
      <h1>Countdown</h1>
      <TimeDisplay seconds={timer.remaining} />
      <TimeInput disabled={timer.status === "running"} onSubmit={timer.startWithDuration} />
    </main>
  );
}

export default App;
