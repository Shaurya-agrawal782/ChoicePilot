"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
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
            Sign in to your account
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
              <label htmlFor="login-email" className={labelCls}>
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="e.g. you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className={labelCls}>
                Password
              </label>
              <input
                id="login-password"
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </div>
        </form>

        <p className="data-label text-xs font-mono text-muted text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
