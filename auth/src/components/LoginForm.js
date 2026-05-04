import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthCard,
  AlertBanner,
  Button,
  Input,
  FormField,
} from "./ui";
import { loginSchema } from "../schemas";
import PasswordInput from "./ui/PasswordInput";

/**
 * LoginForm
 *
 * A fully-controlled, validation-aware login form. All auth logic
 * lives in the parent via the `onSubmit` callback — this component
 * is purely presentational + validation.
 *
 * @param {object}   props
 * @param {function} props.onSubmit          - async (data: { email, password }) => void
 * @param {boolean}  [props.loading=false]   - Shows spinner, disables submit
 * @param {string}   [props.error]           - Top-level error message (e.g. "Invalid credentials")
 * @param {string}   [props.successMessage]  - Shown after successful submission
 * @param {function} [props.onForgotPassword]- Called when "Forgot password?" is clicked
 * @param {function} [props.onSignupClick]   - Called when "Sign up" link is clicked
 * @param {string}   [props.title="Welcome back"]
 * @param {string}   [props.subtitle]
 * @param {boolean}  [props.showCard=true]   - Wrap in AuthCard; set false to embed inline
 * @param {string}   [props.submitLabel="Sign in"]
 * @param {string}   [props.className]
 */
function LoginForm({
  onSubmit,
  loading = false,
  error,
  successMessage,
  onForgotPassword,
  onSignupClick,
  title = "Welcome back",
  subtitle = "Sign in to your account",
  showCard = true,
  submitLabel = "Sign in",
  className,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleFormSubmit = async (data) => {
    if (typeof onSubmit === "function") {
      await onSubmit(data);
    }
  };

  const formContent = (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      {/* Top-level error / success banners */}
      <AlertBanner type="error" message={error} />
      <AlertBanner type="success" message={successMessage} />

      {/* Email */}
      <FormField label="Email" error={errors.email?.message} required>
        <Input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={!!errors.email}
          disabled={loading}
        />
      </FormField>

      {/* Password */}
      <FormField label="Password" error={errors.password?.message} required>
        <PasswordInput
          {...register("password")}
          placeholder="••••••••"
          autoComplete="current-password"
          error={!!errors.password}
          disabled={loading}
        />
        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="self-end text-xs text-blue-600 hover:underline focus:outline-none mt-0.5"
          >
            Forgot password?
          </button>
        )}
      </FormField>

      {/* Submit */}
      <Button type="submit" loading={loading} size="md" className="mt-2">
        {submitLabel}
      </Button>

      {/* Sign-up link */}
      {onSignupClick && (
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignupClick}
            className="text-blue-600 font-medium hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  );

  if (!showCard) return formContent;

  return (
    <AuthCard title={title} subtitle={subtitle} className={className}>
      {formContent}
    </AuthCard>
  );
}

export default LoginForm;