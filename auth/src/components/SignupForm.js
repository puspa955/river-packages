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
import { signupSchema } from "../schemas";
import PasswordInput from "./ui/PasswordInput";

/**
 * SignupForm
 *
 * A fully-controlled, validation-aware signup form. All auth logic
 * lives in the parent via the `onSubmit` callback — this component
 * is purely presentational + validation.
 *
 * @param {object}   props
 * @param {function} props.onSubmit          - async (data: { name, email, password }) => void
 * @param {boolean}  [props.loading=false]   - Shows spinner, disables submit
 * @param {string}   [props.error]           - Top-level error message (e.g. "Email already in use")
 * @param {string}   [props.successMessage]  - Shown after successful submission
 * @param {function} [props.onLoginClick]    - Called when "Sign in" link is clicked
 * @param {string}   [props.title="Create your account"]
 * @param {string}   [props.subtitle]
 * @param {boolean}  [props.showCard=true]   - Wrap in AuthCard; set false to embed inline
 * @param {string}   [props.submitLabel="Create account"]
 * @param {string}   [props.className]
 */
function SignupForm({
  onSubmit,
  loading = false,
  error,
  successMessage,
  onLoginClick,
  title = "Create your account",
  subtitle = "Sign up to get started",
  showCard = true,
  submitLabel = "Create account",
  className,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleFormSubmit = async (data) => {
    if (typeof onSubmit === "function") {
      // strip confirmPassword before handing off to the caller
      const { confirmPassword, ...payload } = data;
      await onSubmit(payload);
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

      {/* Full name */}
      <FormField label="Full name" error={errors.name?.message} required>
        <Input
          {...register("name")}
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          error={!!errors.name}
          disabled={loading}
        />
      </FormField>

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
          autoComplete="new-password"
          error={!!errors.password}
          disabled={loading}
        />
      </FormField>

      {/* Confirm password */}
      <FormField
        label="Confirm password"
        error={errors.confirmPassword?.message}
        required
      >
        <PasswordInput
          {...register("confirmPassword")}
          placeholder="••••••••"
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          disabled={loading}
        />
      </FormField>

      {/* Submit */}
      <Button type="submit" loading={loading} size="md" className="mt-2">
        {submitLabel}
      </Button>

      {/* Sign-in link */}
      {onLoginClick && (
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-blue-600 font-medium hover:underline focus:outline-none"
          >
            Sign in
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

export default SignupForm;
