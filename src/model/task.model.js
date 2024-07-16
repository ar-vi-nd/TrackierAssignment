import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    taskStatus: {
        type: String,
        enum: ["Backlog", "In Discussion", "In Progress", "Done"],
        default: "Backlog"
    },
    assignedUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tags: [
        {
            type: String
        }
    ],
    dueDate: {
        type: Date
    },
   
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
