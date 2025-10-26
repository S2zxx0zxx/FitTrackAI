import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'telemetry_opt_in_v1';

export default function TelemetryOptIn() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
  }, [enabled]);

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-4 h-4"
          aria-label="Enable anonymous usage telemetry"
        />
        <span>Enable anonymous usage telemetry</span>
      </label>
      <a href="#" className="underline text-xs opacity-80">Privacy</a>
    </div>
  );
}
