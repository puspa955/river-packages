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
 * @param {function} props.onLogin                   - async ({ email, password }) => void
 * @param {function} props.onSignup                  - async ({ name, email, password }) => void
 * @param {function} props.onResetPassword           - async ({ email }) => void
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
  loading = false,
  loginError,
  signupError,
  resetError,
  resetSuccess,
  className,
}) {
  const [step, setStep] = useState(initialStep);

  const goTo = (next) => () => setStep(next);

  if (step === "signup") {
    return (
      <SignupForm
        onSubmit={onSignup}
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

  // default: login
  return (
    <LoginForm
      onSubmit={onLogin}
      loading={loading}
      error={loginError}
      onForgotPassword={goTo("reset")}
      onSignupClick={goTo("signup")}
      className={className}
    />
  );
}

export default AuthFlow;