import mongoose, { InferSchemaType, Model, Schema, Types } from "mongoose";

const TaskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, title: 1 });

export type TaskDocument = InferSchemaType<typeof TaskSchema> & {
  _id: Types.ObjectId;
};

export const Task = (mongoose.models.Task as Model<TaskDocument>) ||
  mongoose.model<TaskDocument>("Task", TaskSchema);
