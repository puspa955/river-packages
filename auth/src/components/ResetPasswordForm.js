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
import { resetPasswordSchema } from "../schemas";

/**
 * ResetPasswordForm
 *
 * A fully-controlled, validation-aware "request a password reset" form.
 * The parent owns the side-effect (typically: send a reset link via email).
 *
 * @param {object}   props
 * @param {function} props.onSubmit            - async (data: { email }) => void
 * @param {boolean}  [props.loading=false]     - Shows spinner, disables submit
 * @param {string}   [props.error]             - Top-level error message
 * @param {string}   [props.successMessage]    - Shown after a successful request
 * @param {function} [props.onBackToLogin]     - Called when "Back to sign in" is clicked
 * @param {string}   [props.title="Reset your password"]
 * @param {string}   [props.subtitle]
 * @param {boolean}  [props.showCard=true]     - Wrap in AuthCard; set false to embed inline
 * @param {string}   [props.submitLabel="Send reset link"]
 * @param {string}   [props.className]
 */
function ResetPasswordForm({
  onSubmit,
  loading = false,
  error,
  successMessage,
  onBackToLogin,
  title = "Reset your password",
  subtitle = "Enter your email and we'll send you a reset link",
  showCard = true,
  submitLabel = "Send reset link",
  className,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
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

      {/* Submit */}
      <Button type="submit" loading={loading} size="md" className="mt-2">
        {submitLabel}
      </Button>

      {/* Back to login */}
      {onBackToLogin && (
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm text-center text-blue-600 hover:underline focus:outline-none"
        >
          ← Back to sign in
        </button>
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

export default ResetPasswordForm;
