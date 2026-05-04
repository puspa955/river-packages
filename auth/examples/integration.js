/**
 * Example: integrating @ankamala/auth in a real application.
 *
 * Patterns shown:
 *  1. Using AuthFlow (all-in-one)
 *  2. Using individual components (LoginForm, SignupForm, etc.)
 *  3. Using OTPInput for 2FA
 *  4. Extending with OTP after login
 *
 * Auth logic (API calls, token storage) stays entirely in the app layer.
 */

import React, { useState } from "react";
import {
  AuthFlow,
  LoginForm,
  SignupForm,
  ResetPasswordForm,
  OTPInput,
  AuthCard,
  AlertBanner,
  Button,
} from "@ankamala/auth";

// ─── Example 1: Drop-in AuthFlow ─────────────────────────────────────────────
// The simplest integration. AuthFlow manages step navigation internally.

export function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setLoginError(null);
    try {
      // YOUR auth logic here — e.g. Firebase, Supabase, custom API, etc.
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        setLoginError(message || "Invalid email or password.");
        return;
      }
      const { token } = await response.json();
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async ({ name, email, password }) => {
    setLoading(true);
    setSignupError(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        const { message } = await response.json();
        setSignupError(message || "Could not create account.");
        return;
      }
      window.location.href = "/onboarding";
    } catch {
      setSignupError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async ({ email }) => {
    setLoading(true);
    setResetError(null);
    setResetSuccess(null);
    try {
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResetSuccess("If that email exists, you'll receive a reset link shortly.");
    } catch {
      setResetError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AuthFlow
        onLogin={handleLogin}
        onSignup={handleSignup}
        onResetPassword={handleResetPassword}
        loading={loading}
        loginError={loginError}
        signupError={signupError}
        resetError={resetError}
        resetSuccess={resetSuccess}
      />
    </div>
  );
}

// ─── Example 2: Custom login page with 2FA ────────────────────────────────────
// Shows how to compose individual components and extend with OTP.

export function LoginWithOTP() {
  const [step, setStep] = useState("login"); // 'login' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [sessionToken, setSessionToken] = useState(null); // temp token from /login

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Invalid credentials.");
        return;
      }
      const { sessionToken: token } = await res.json();
      setSessionToken(token);
      setStep("otp"); // proceed to OTP verification
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit code.");
      return;
    }
    setLoading(true);
    setOtpError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, sessionToken }),
      });
      if (!res.ok) {
        setOtpError("Invalid or expired code.");
        return;
      }
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <AuthCard
          title="Two-factor verification"
          subtitle="Enter the 6-digit code sent to your device"
        >
          <div className="flex flex-col gap-4">
            <AlertBanner type="error" message={otpError} />
            <div className="flex justify-center">
              <OTPInput
                length={6}
                onChange={setOtp}
                onComplete={handleOTPVerify}
                error={!!otpError}
                disabled={loading}
              />
            </div>
            <Button onClick={handleOTPVerify} loading={loading}>
              Verify code
            </Button>
            <button
              type="button"
              onClick={() => setStep("login")}
              className="text-sm text-center text-blue-600 hover:underline"
            >
              ← Back to sign in
            </button>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        subtitle="Sign in to continue to 2FA verification"
      />
    </div>
  );
}

// ─── Example 3: Inline embedding (no card wrapper) ───────────────────────────
// showCard=false lets you embed forms inside your own modals / panels.

export function LoginModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (data) => {
    setLoading(true);
    // ... auth logic ...
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Sign in</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        {/* No AuthCard wrapper — we're inside our own modal */}
        <LoginForm
          showCard={false}
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}