import { ZodError } from "zod";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireCurrentUser } from "@/lib/auth";
import { getErrorMessage, getZodFieldErrors } from "@/lib/errors";
import { connectToDatabase } from "@/lib/mongodb";
import { encryptTaskDescription, serializeTask } from "@/lib/task-serializer";
import { createTaskSchema, taskStatusEnum } from "@/lib/validations";
import { Task } from "@/models/Task";

function parseListParams(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page") ?? "1") || 1, 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "10") || 10, 1), 50);
  const status = searchParams.get("status")?.trim() ?? "";
  const search = searchParams.get("search")?.trim() ?? "";

  if (status) {
    taskStatusEnum.parse(status);
  }

  return { page, limit, status, search };
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const user = await requireCurrentUser();
    const { page, limit, status, search } = parseListParams(request);

    const query: Record<string, unknown> = { userId: user.id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Task.countDocuments(query),
    ]);

    return successResponse("Tasks fetched successfully", {
      items: tasks.map(serializeTask),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
      filters: {
        status: status || null,
        search,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 400, getZodFieldErrors(error));
    }

    if (getErrorMessage(error) === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }

    return errorResponse(getErrorMessage(error, "Failed to fetch tasks"), 500);
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const user = await requireCurrentUser();
    const body = await request.json();
    const payload = createTaskSchema.parse(body);

    const task = await Task.create({
      userId: user.id,
      title: payload.title,
      description: encryptTaskDescription(payload.description),
      status: payload.status,
    });

    return successResponse("Task created successfully", { task: serializeTask(task) }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 400, getZodFieldErrors(error));
    }

    if (getErrorMessage(error) === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }

    return errorResponse(getErrorMessage(error, "Failed to create task"), 500);
  }
}
