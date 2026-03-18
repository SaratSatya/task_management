import { Types } from "mongoose";
import { decryptText, encryptText } from "@/lib/encryption";

export type SafeTask = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
};

export function serializeTask(task: {
  _id: Types.ObjectId | string;
  title: string;
  description: string;
  status: SafeTask["status"];
  createdAt: Date;
  updatedAt: Date;
}): SafeTask {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description ? decryptText(task.description) : "",
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function encryptTaskDescription(description: string) {
  return description ? encryptText(description) : "";
}
