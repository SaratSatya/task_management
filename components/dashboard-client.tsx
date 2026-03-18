"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SafeUser } from "@/lib/auth";
import type { SafeTask } from "@/lib/task-serializer";

type TaskListResponse = {
  success: boolean;
  message: string;
  data: {
    items: SafeTask[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters: {
      status: string | null;
      search: string;
    };
  };
};

type DashboardClientProps = {
  user: SafeUser;
};

const statusOptions: Array<SafeTask["status"]> = ["pending", "in-progress", "completed"];
const pageSize = 5;

const initialTaskForm = {
  title: "",
  description: "",
  status: "pending" as SafeTask["status"],
};

export function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<SafeTask[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [statusInput, setStatusInput] = useState(searchParams.get("status") ?? "");

  const page = useMemo(() => {
    const value = Number(searchParams.get("page") ?? "1");
    return Number.isFinite(value) && value > 0 ? value : 1;
  }, [searchParams]);

  async function loadTasks() {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pageSize));

    if (statusInput) {
      params.set("status", statusInput);
    }

    if (searchInput) {
      params.set("search", searchInput);
    }

    const response = await fetch(`/api/tasks?${params.toString()}`, { cache: "no-store" });
    const result = (await response.json()) as TaskListResponse;

    if (!response.ok) {
      setError(result.message);
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setTasks(result.data.items);
    setPagination(result.data.pagination);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusInput, searchInput]);

  function updateRoute(nextPage: number, nextStatus = statusInput, nextSearch = searchInput) {
    const params = new URLSearchParams();
    params.set("page", String(nextPage));

    if (nextStatus) {
      params.set("status", nextStatus);
    }

    if (nextSearch) {
      params.set("search", nextSearch);
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const endpoint = editingTaskId ? `/api/tasks/${editingTaskId}` : "/api/tasks";
    const method = editingTaskId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskForm),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.message);
      setIsSaving(false);
      return;
    }

    setTaskForm(initialTaskForm);
    setEditingTaskId(null);
    setMessage(result.message);
    setIsSaving(false);
    await loadTasks();
  }

  function startEditing(task: SafeTask) {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setMessage(null);
    setError(null);
  }

  async function handleDelete(taskId: string) {
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    if (editingTaskId === taskId) {
      setEditingTaskId(null);
      setTaskForm(initialTaskForm);
    }
    await loadTasks();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
      <aside className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:max-w-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">Hello, {user.name}</h1>
          <p className="text-sm text-slate-600">Create, search, and manage your personal tasks.</p>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Signed in as</p>
          <p>{user.email}</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="title">
              Title
            </label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              id="title"
              value={taskForm.title}
              onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Prepare sprint notes"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="description">
              Description
            </label>
            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3"
              id="description"
              value={taskForm.description}
              onChange={(event) =>
                setTaskForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Add any context for this task"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="status">
              Status
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              id="status"
              value={taskForm.status}
              onChange={(event) =>
                setTaskForm((current) => ({
                  ...current,
                  status: event.target.value as SafeTask["status"],
                }))
              }
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Saving..." : editingTaskId ? "Update task" : "Create task"}
            </button>
            {editingTaskId ? (
              <button
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                onClick={() => {
                  setEditingTaskId(null);
                  setTaskForm(initialTaskForm);
                }}
                type="button"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <button
          className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
          onClick={handleLogout}
          type="button"
        >
          Log out
        </button>
      </aside>

      <section className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Your tasks</h2>
            <p className="text-sm text-slate-600">Filter by status, search by title, and manage your own records only.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="rounded-xl border border-slate-200 px-4 py-3"
              placeholder="Search title"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <select
              className="rounded-xl border border-slate-200 px-4 py-3"
              value={statusInput}
              onChange={(event) => setStatusInput(event.target.value)}
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
              onClick={() => updateRoute(1)}
              type="button"
            >
              Apply
            </button>
          </div>
        </div>

        {message ? <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        {isLoading ? (
          <div className="py-16 text-center text-slate-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center text-slate-500">No tasks matched your current filters.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {tasks.map((task) => (
              <article key={task.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {task.status}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-slate-600">{task.description || "No description provided."}</p>
                    <p className="text-xs text-slate-400">
                      Created {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                      onClick={() => startEditing(task)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                      onClick={() => handleDelete(task.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Page {pagination.page} of {pagination.totalPages} • {pagination.total} total tasks
          </p>
          <div className="flex gap-3">
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              disabled={pagination.page <= 1}
              onClick={() => updateRoute(pagination.page - 1)}
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => updateRoute(pagination.page + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
