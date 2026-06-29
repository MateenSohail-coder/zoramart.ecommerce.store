"use client";

import * as React from "react";

export default function UserSettingPage() {
  const [state, setState] = React.useState({
    theme: "system",
    email: "",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Settings</h2>

      <div className="rounded-xl border bg-white p-4 space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Theme</span>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={state.theme}
            onChange={(e) => setState((s) => ({ ...s, theme: e.target.value }))}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          />
        </label>

        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={() => alert("Settings save not wired to backend yet")}
        >
          Save
        </button>
      </div>
    </div>
  );
}
