// ── Components ────────────────────────────────────────────────────────────────
export { default as LoginForm } from "./components/LoginForm";
export { default as SignupForm } from "./components/SignupForm";
export { default as ResetPasswordForm } from "./components/ResetPasswordForm";
export { default as OTPInput } from "./components/OTPInput";
export { default as AuthFlow } from "./components/AuthFlow";

// ── Primitive UI (re-exported for consumers who want to extend) ───────────────
export {
  AuthCard,
  AlertBanner,
  Button,
  FormField,
  Input,
  Label,
  cn,
} from "./components/ui";
export { default as PasswordInput } from "./components/ui/PasswordInput";

// ── Schemas (for reuse in app-level validation) ───────────────────────────────
export {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  otpSchema,
} from "./schemas";