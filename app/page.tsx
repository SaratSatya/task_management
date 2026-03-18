export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Task Management MVP</p>
          <h1 className="text-5xl font-semibold leading-tight text-balance">
            Secure task tracking with cookie-based authentication.
          </h1>
          <p className="text-lg text-slate-300">
            Manage your own tasks with MongoDB persistence, protected routes, search, filters,
            pagination, and structured API responses built on the existing foundation layer.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white">
            Create account
            </Link>
            <Link className="rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white" href="/login">
              Log in
            </Link>
          </div>
        </div>

        <div className="grid max-w-xl gap-4 md:grid-cols-2">
          {[
            "JWT auth stored in HTTP-only cookies",
            "Per-user task authorization",
            "Encrypted task descriptions at rest",
            "Search, status filters, and pagination",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200 backdrop-blur">
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
