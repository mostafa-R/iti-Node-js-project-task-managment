import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    Status: {
      type: String,
      enum: ["pending", "progress", "completed"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ category: 1 });
taskSchema.index({ priority: 1 });


taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  this.populate({
    path: "user",
    select: "name -_id",
  });
  next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
