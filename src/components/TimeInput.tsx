import { useState } from "react";
import { parseDuration } from "../lib/time";

interface Props {
  disabled: boolean;
  onSubmit: (seconds: number) => void;
}

export default function TimeInput({ disabled, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const seconds = parseDuration(value);
    if (seconds === null) {
      setError("Thời lượng không hợp lệ. Ví dụ: 1.20.30, 5.30, .45, 2m30s");
      return;
    }
    setError("");
    setValue("");
    onSubmit(seconds);
  }

  return (
    <form className="time-input" onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) setError("");
        }}
        placeholder="VD: 1.20.30, 5.30, .45, 2m30s"
        disabled={disabled}
        autoFocus
      />
      {error && <p className="error">{error}</p>}
    </form>
  );
}
