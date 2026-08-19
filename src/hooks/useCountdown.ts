import { useCallback, useEffect, useRef, useState } from "react";

export type TimerStatus = "idle" | "running" | "finished";

interface CountdownState {
  /** Total duration in seconds set by the user. */
  duration: number;
  /** Remaining seconds to display. */
  remaining: number;
  status: TimerStatus;
}

const initialState: CountdownState = {
  duration: 0,
  remaining: 0,
  status: "idle",
};

/**
 * Timestamp-based countdown: remaining is always computed from an absolute
 * endTime, never from tick counts, so it stays accurate when the app is
 * busy or the window is throttled. onFinish fires exactly once per cycle.
 */
export function useCountdown(onFinish: () => void) {
  const [state, setState] = useState<CountdownState>(initialState);
  const endTimeRef = useRef(0);
  const alertFiredRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (state.status !== "running") return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setState((prev) => ({ ...prev, remaining }));

      if (remaining === 0) {
        if (!alertFiredRef.current) {
          alertFiredRef.current = true;
          onFinishRef.current();
        }
        setState((prev) => ({ ...prev, status: "finished" }));
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state.status]);

  const setDuration = useCallback((seconds: number) => {
    endTimeRef.current = 0;
    alertFiredRef.current = false;
    setState({ duration: seconds, remaining: seconds, status: "idle" });
  }, []);

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.duration <= 0) return prev;
      endTimeRef.current = Date.now() + prev.remaining * 1000;
      alertFiredRef.current = false;
      return { ...prev, status: "running" };
    });
  }, []);

  const startWithDuration = useCallback((seconds: number) => {
    if (seconds <= 0) return;
    endTimeRef.current = Date.now() + seconds * 1000;
    alertFiredRef.current = false;
    setState({ duration: seconds, remaining: seconds, status: "running" });
  }, []);

  const reset = useCallback(() => {
    endTimeRef.current = 0;
    alertFiredRef.current = false;
    setState((prev) => ({ ...prev, remaining: prev.duration, status: "idle" }));
  }, []);

  return { ...state, setDuration, start, startWithDuration, reset };
}
