"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data: unknown = await res.json();
      if (!res.ok) {
        const errData = data as { error?: string };
        setError(errData.error ?? "Registration failed. Please try again.");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors";
  const labelCls =
    "data-label text-[10px] font-mono font-semibold uppercase tracking-wider text-muted block mb-1.5";

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-2">
            CHOICEPILOT
          </span>
          <h1 className="display-heading text-2xl font-normal leading-tight text-ink">
            Create your account
          </h1>
        </div>

        {error && (
          <div className="bg-warning/5 border border-warning/20 rounded-xl px-4 py-3 mb-5">
            <p className="data-label text-xs font-mono text-warning">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="signup-name" className={labelCls}>
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label htmlFor="signup-email" className={labelCls}>
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="e.g. you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password" className={labelCls}>
                Password (min 8 chars)
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="data-label text-xs font-mono text-muted text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
