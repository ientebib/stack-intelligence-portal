"use client";

import { FormEvent, useEffect, useState } from "react";

const DEFAULT_ACCESS_HASH = "dGhlc3RhY2syMDI1";

export default function HomePage() {
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("deck_auth") === "1") {
      window.location.href = "/deck";
    }
  }, []);

  function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const accessHash = process.env.NEXT_PUBLIC_ACCESS_HASH ?? DEFAULT_ACCESS_HASH;

    if (btoa(password) === accessHash) {
      sessionStorage.setItem("deck_auth", "1");
      window.location.href = "/deck";
      return;
    }

    setPassword("");
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }

  return (
    <main className="auth-body">
      <div className="gate">
        <div className="logo-mark">
          <span>S</span>
        </div>
        <div className="fund-name">Stack Holdings</div>
        <div className="fund-sub">Investment Thesis</div>

        <form id="authForm" onSubmit={handleAuth}>
          <div className="input-group">
            <input
              type="password"
              id="passInput"
              placeholder="Enter access code"
              autoComplete="off"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            View Presentation
          </button>
        </form>

        <div className={`error-msg ${showError ? "show" : ""}`}>Incorrect access code</div>
        <div className="footer-text">Confidential - Authorized recipients only</div>
      </div>
    </main>
  );
}
