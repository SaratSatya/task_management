import { Types } from "mongoose";
import { ZodError } from "zod";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireCurrentUser } from "@/lib/auth";
import { getErrorMessage, getZodFieldErrors } from "@/lib/errors";
import { connectToDatabase } from "@/lib/mongodb";
import { encryptTaskDescription, serializeTask } from "@/lib/task-serializer";
import { updateTaskSchema } from "@/lib/validations";
import { Task } from "@/models/Task";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

async function getOwnedTask(taskId: string, userId: string) {
  if (!Types.ObjectId.isValid(taskId)) {
    return null;
  }

  return Task.findOne({ _id: taskId, userId });
}

export async function GET(_: Request, context: RouteContext) {
  try {
    await connectToDatabase();
    const user = await requireCurrentUser();
    const { taskId } = await context.params;
    const task = await getOwnedTask(taskId, user.id);

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    return successResponse("Task fetched successfully", { task: serializeTask(task) });
  } catch (error) {
    if (getErrorMessage(error) === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }

    return errorResponse(getErrorMessage(error, "Failed to fetch task"), 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await connectToDatabase();
    const user = await requireCurrentUser();
    const { taskId } = await context.params;
    const task = await getOwnedTask(taskId, user.id);

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    const body = await request.json();
    const payload = updateTaskSchema.parse(body);

    if (payload.title !== undefined) {
      task.title = payload.title;
    }

    if (payload.description !== undefined) {
      task.description = encryptTaskDescription(payload.description);
    }

    if (payload.status !== undefined) {
      task.status = payload.status;
    }

    await task.save();

    return successResponse("Task updated successfully", { task: serializeTask(task) });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", 400, getZodFieldErrors(error));
    }

    if (getErrorMessage(error) === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }

    return errorResponse(getErrorMessage(error, "Failed to update task"), 500);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    await connectToDatabase();
    const user = await requireCurrentUser();
    const { taskId } = await context.params;
    const task = await getOwnedTask(taskId, user.id);

    if (!task) {
      return errorResponse("Task not found", 404);
    }

    await task.deleteOne();

    return successResponse("Task deleted successfully");
  } catch (error) {
    if (getErrorMessage(error) === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }

    return errorResponse(getErrorMessage(error, "Failed to delete task"), 500);
  }
}
