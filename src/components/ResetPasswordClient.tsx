"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordClient() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initRecovery() {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error_description") || params.get("error");
      if (urlError) {
        if (mounted) {
          setError(decodeURIComponent(urlError));
          setLoadingSession(false);
        }
        return;
      }

      // Check if code is present in URL (in case arrived directly at /reset-password?code=...)
      const code = params.get("code");
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn("Direct code exchange warning:", exchangeError.message);
          }
        } catch (_) {
          // Handled or already exchanged by SSR callback
        }
      }

      // Verify active session or recovery state
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setHasSession(true);
        }
        setLoadingSession(false);
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        if (mounted) {
          setHasSession(true);
          setLoadingSession(false);
        }
      }
    });

    initRecovery();

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setMessage("Password updated successfully! Redirecting to sign in...");
      setTimeout(() => {
        window.location.href = "/auth";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Link */}
        <div className="mb-8 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 text-brand-600 font-bold text-2xl tracking-tighter">
            smartXman
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          {loadingSession ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Verifying security recovery link...</p>
            </div>
          ) : !hasSession ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-800/40">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invalid or Expired Link</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {error || "This password recovery link has already been used or has expired for security reasons. Please request a new reset link."}
                </p>
              </div>
              <Link
                href="/auth"
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 inline-flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Request New Link
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Set New Password</h2>
              <p className="text-slate-500 mb-8">Choose a strong, secure password for your smartXman account.</p>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                      placeholder="Min. 8 characters"
                      disabled={submitting || !!message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                      placeholder="Re-enter password"
                      disabled={submitting || !!message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !!message}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm uppercase tracking-wider cursor-pointer"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
