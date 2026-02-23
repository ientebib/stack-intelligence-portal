"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { NeuralStackLogo } from "@/components/ui/NeuralStackLogo";

const DEFAULT_INVESTOR_HASH = "Y2xhbmtlcg=="; // base64 of "clanker"
const ALLOWED_EMAILS = ["marcos@thestack.capital", "isaac@thestack.capital"];

export function InvestorAuthGate({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem("investor_auth") === "1");
    setIsReady(true);
  }, []);

  function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const accessHash =
      process.env.NEXT_PUBLIC_INVESTOR_ACCESS_HASH ?? DEFAULT_INVESTOR_HASH;

    if (
      ALLOWED_EMAILS.includes(email.toLowerCase().trim()) &&
      btoa(password) === accessHash
    ) {
      sessionStorage.setItem("investor_auth", "1");
      setIsAuthenticated(true);
      setPassword("");
      return;
    }

    setPassword("");
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }

  if (!isReady) return null;

  if (isAuthenticated) return <>{children}</>;

  return (
    <main className="investor-login-body">
      <div className="investor-login-card">
        <div className="investor-login-logo-wrap">
          <NeuralStackLogo size={64} interactive animate density="high" />
        </div>
        <p className="investor-login-kicker">Stack Capital</p>
        <h1 className="investor-login-title">Investor Portal</h1>

        <form className="investor-login-form" onSubmit={handleAuth}>
          <div className="investor-login-field">
            <label className="investor-login-label" htmlFor="inv-gate-email">
              Email
            </label>
            <input
              id="inv-gate-email"
              className="investor-login-input"
              type="email"
              placeholder="name@firm.com"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="investor-login-field">
            <label className="investor-login-label" htmlFor="inv-gate-pass">
              Password
            </label>
            <input
              id="inv-gate-pass"
              className="investor-login-input"
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="investor-login-submit">
            Sign In
          </button>
        </form>

        <div className={`error-msg ${showError ? "show" : ""}`}>
          Incorrect password
        </div>

        <div className="investor-login-become">
          <a href="/contact" className="investor-login-become-link">
            Want to become an investor? Contact us &rarr;
          </a>
        </div>

        <div className="investor-login-footer">
          <Link href="/" className="investor-login-footer-link">
            &larr; Back
          </Link>
        </div>
      </div>
    </main>
  );
}
