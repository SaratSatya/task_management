import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const taskStatusEnum = z.enum(["pending", "in-progress", "completed"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().trim().max(2000, "Description is too long").optional().default(""),
  status: taskStatusEnum.default("pending"),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(2000).optional(),
  status: taskStatusEnum.optional(),
});