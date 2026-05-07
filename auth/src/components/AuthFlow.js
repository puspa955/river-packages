import React, { useState } from "react";
import SignupForm from "./SignupForm";
import ResetPasswordForm from "./ResetPasswordForm";
import LoginForm from "./LoginForm";

/**
 * Auth steps managed internally by AuthFlow.
 * @typedef {'login' | 'signup' | 'reset'} AuthStep
 */

/**
 * AuthFlow
 *
 * Composes LoginForm / SignupForm / ResetPasswordForm into a single
 * controlled flow. Navigation between steps is handled internally;
 * all auth side-effects are delegated to the caller via callbacks.
 *
 * @param {object}   props
 * @param {AuthStep} [props.initialStep='login']     - Which view to show first
 * @param {function} props.onLogin                   - async ({ email, password }) => { user, token }
 * @param {function} props.onSignup                  - async ({ name, email, password }) => void
 * @param {function} props.onResetPassword           - async ({ email }) => void
 * @param {function} [props.onLoginSuccess]          - (result) => void — called after login resolves; use to redirect
 * @param {boolean}  [props.loading=false]           - Global loading state (disables all forms)
 * @param {string}   [props.loginError]
 * @param {string}   [props.signupError]
 * @param {string}   [props.resetError]
 * @param {string}   [props.resetSuccess]            - Shown after a successful reset request
 * @param {string}   [props.className]
 */
function AuthFlow({
  initialStep = "login",
  onLogin,
  onSignup,
  onResetPassword,
  onLoginSuccess,
  loading = false,
  loginError,
  signupError,
  resetError,
  resetSuccess,
  className,
}) {
  const [step, setStep] = useState(initialStep);
  const [postSignupMessage, setPostSignupMessage] = useState(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState(null);

  const goTo = (next) => () => setStep(next);

  const handleSignup = async (data) => {
    if (typeof onSignup === "function") {
      await onSignup(data);
    }
    setPostSignupMessage("Account created successfully! Please sign in.");
    setStep("login");
  };

  const handleLogin = async (data) => {
    if (typeof onLogin === "function") {
      const result = await onLogin(data);
      setLoginSuccessMessage("Logged in successfully! Redirecting...");
      setTimeout(() => {
        if (typeof onLoginSuccess === "function") {
          onLoginSuccess(result);
        }
      }, 1500);
    }
  };

  if (step === "signup") {
    return (
      <SignupForm
        onSubmit={handleSignup}
        loading={loading}
        error={signupError}
        onLoginClick={goTo("login")}
        className={className}
      />
    );
  }

  if (step === "reset") {
    return (
      <ResetPasswordForm
        onSubmit={onResetPassword}
        loading={loading}
        error={resetError}
        successMessage={resetSuccess}
        onBackToLogin={goTo("login")}
        className={className}
      />
    );
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={loading}
      error={loginError}
      successMessage={loginSuccessMessage || postSignupMessage}
      onForgotPassword={goTo("reset")}
      onSignupClick={goTo("signup")}
      className={className}
    />
  );
}

export default AuthFlow;