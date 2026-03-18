"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

type ApiResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]> | null;
};

const modeConfig = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to manage your tasks.",
    submitLabel: "Log in",
    alternateLabel: "Need an account? Sign up",
    alternateHref: "/signup",
    endpoint: "/api/auth/login",
  },
  signup: {
    title: "Create your account",
    subtitle: "Sign up to start tracking tasks.",
    submitLabel: "Create account",
    alternateLabel: "Already have an account? Log in",
    alternateHref: "/login",
    endpoint: "/api/auth/signup",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const config = modeConfig[mode];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as ApiResponse;

    if (!response.ok) {
      setMessage(result.message);
      setFieldErrors(result.errors ?? {});
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">{config.title}</h1>
        <p className="text-sm text-slate-600">{config.subtitle}</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Name
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
              id="name"
              name="name"
              placeholder="Jane Doe"
              required
            />
            {fieldErrors.name ? <p className="text-sm text-red-600">{fieldErrors.name[0]}</p> : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            required
          />
          {fieldErrors.email ? <p className="text-sm text-red-600">{fieldErrors.email[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
            id="password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            required
          />
          {fieldErrors.password ? <p className="text-sm text-red-600">{fieldErrors.password[0]}</p> : null}
          {fieldErrors.credentials ? (
            <p className="text-sm text-red-600">{fieldErrors.credentials[0]}</p>
          ) : null}
        </div>

        {message ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        ) : null}

        <button
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Please wait..." : config.submitLabel}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        <Link className="font-medium text-slate-900 hover:underline" href={config.alternateHref}>
          {config.alternateLabel}
        </Link>
      </div>
    </div>
  );
}
