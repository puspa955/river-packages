# @ankamala/auth

Reusable auth UI components for the `river-packages` monorepo.  
Provides fully-validated forms with **zero backend coupling** — all auth logic stays in your app.

---

## Install

```bash
npm install @ankamala/auth
# peer deps
npm install react react-hook-form @hookform/resolvers zod
```

---

## Components

| Component           | Description                                         |
|---------------------|-----------------------------------------------------|
| `LoginForm`         | Email + password login with validation              |
| `SignupForm`        | Name + email + password + confirm password          |
| `ResetPasswordForm` | Collects email to trigger password reset            |
| `OTPInput`          | 6-digit segmented OTP input with paste support      |
| `AuthFlow`          | Orchestrates all three forms with internal routing  |

---

## Quick start — AuthFlow (recommended)

```jsx
import { AuthFlow } from "@ankamala/auth";

function AuthPage() {
  const handleLogin = async ({ email, password }) => {
    // your auth logic: fetch, Firebase, Supabase, etc.
  };

  return (
    <AuthFlow
      onLogin={handleLogin}
      onSignup={handleSignup}
      onResetPassword={handleReset}
      loading={isLoading}
      loginError={loginError}
    />
  );
}
```

---

## Props reference

### LoginForm

| Prop               | Type       | Default        | Description                              |
|--------------------|------------|----------------|------------------------------------------|
| `onSubmit`         | `function` | —              | `async ({ email, password }) => void`    |
| `loading`          | `boolean`  | `false`        | Shows spinner, disables form             |
| `error`            | `string`   | —              | Top-level server error message           |
| `successMessage`   | `string`   | —              | Success banner text                      |
| `onForgotPassword` | `function` | —              | Called on "Forgot password?" click       |
| `onSignupClick`    | `function` | —              | Called on "Sign up" link click           |
| `title`            | `string`   | `"Welcome back"` | Card heading                           |
| `subtitle`         | `string`   | `"Sign in to your account"` | Card subheading           |
| `showCard`         | `boolean`  | `true`         | Wrap in `AuthCard`; set `false` to embed |
| `submitLabel`      | `string`   | `"Sign in"`    | Submit button label                      |
| `className`        | `string`   | —              | Applied to the wrapper                   |

### SignupForm

Same shape as `LoginForm`, plus:

| Prop           | Type       | Default            | Description                        |
|----------------|------------|--------------------|------------------------------------|
| `onSubmit`     | `function` | —                  | `async ({ name, email, password, confirmPassword }) => void` |
| `onLoginClick` | `function` | —                  | Called on "Sign in" link click     |
| `title`        | `string`   | `"Create account"` |                                    |
| `submitLabel`  | `string`   | `"Create account"` |                                    |

### ResetPasswordForm

| Prop              | Type       | Default                | Description                      |
|-------------------|------------|------------------------|----------------------------------|
| `onSubmit`        | `function` | —                      | `async ({ email }) => void`      |
| `successMessage`  | `string`   | —                      | Shown after successful request   |
| `onBackToLogin`   | `function` | —                      | Called on "Back to sign in" click|
| `title`           | `string`   | `"Reset password"`     |                                  |
| `submitLabel`     | `string`   | `"Send reset link"`    |                                  |

### OTPInput

| Prop         | Type       | Default | Description                              |
|--------------|------------|---------|------------------------------------------|
| `length`     | `number`   | `6`     | Number of digit boxes                    |
| `onChange`   | `function` | —       | `(otp: string) => void` on every keystroke |
| `onComplete` | `function` | —       | `(otp: string) => void` when all filled  |
| `disabled`   | `boolean`  | `false` |                                          |
| `error`      | `boolean`  | `false` | Triggers red border styling              |
| `value`      | `string`   | —       | Controlled value                         |

### AuthFlow

| Prop               | Type       | Default   | Description                              |
|--------------------|------------|-----------|------------------------------------------|
| `initialStep`      | `string`   | `'login'` | `'login'` \| `'signup'` \| `'reset'`    |
| `onLogin`          | `function` | —         |                                          |
| `onSignup`         | `function` | —         |                                          |
| `onResetPassword`  | `function` | —         |                                          |
| `loading`          | `boolean`  | `false`   |                                          |
| `loginError`       | `string`   | —         |                                          |
| `signupError`      | `string`   | —         |                                          |
| `resetError`       | `string`   | —         |                                          |
| `resetSuccess`     | `string`   | —         |                                          |

---

## Embedding without the card

Set `showCard={false}` to embed a form inside your own modal or panel:

```jsx
<LoginForm showCard={false} onSubmit={handleLogin} loading={loading} />
```

---

## Reusing schemas in your app

```js
import { loginSchema } from "@ankamala/auth";

// Use the same Zod schema in your server-side validation or other forms
const parsed = loginSchema.safeParse(req.body);
```

---

## Folder structure

```
auth/
├── src/
│   ├── components/
│   │   ├── ui/               # AuthCard, Button, Input, FormField, Label, AlertBanner
│   │   │   └── PasswordInput.js
│   │   ├── LoginForm/
│   │   ├── SignupForm/
│   │   ├── ResetPasswordForm/
│   │   ├── OTPInput/
│   │   └── AuthFlow/
│   ├── schemas/              # Zod schemas (exported for reuse)
│   └── index.js              # Public API
├── examples/
│   └── integration.jsx       # Real-world usage examples
└── package.json
```