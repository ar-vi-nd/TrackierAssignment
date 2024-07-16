import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import Task from "../model/task.model.js";
import Project from '../model/project.model.js'
import { isValidObjectId } from "mongoose";
const addTask = asyncHandler(async(req,res)=>{


    const { project, taskName, taskDescription, tags, dueDate } = req.body;

    const existingTask = await Task.findOne({taskName,assignedUser:req.user._id});
    if (existingTask) {
        // throw new ApiError(400, "Project name already exists");
       return res.status(400).json(new ApiError(400, "Task name already exists"));

    }

    if(!isValidObjectId(project)){
       return res.status(400).json(new ApiError(400, "Project doesn't exist"));

    }

    const existingProject = await Project.findOne({_id:project,projectUser:req.user._id});
    if (!existingProject) {
       return res.status(400).json(new ApiError(400, "Project doesn't exist"));

    }

    const newTask = await Task.create({
        project,
        taskName,
        taskDescription,
        tags,
        dueDate,
        assignedUser:req.user._id
    });


    if(newTask){
        const updatedProject = await Project.findByIdAndUpdate(project, { $push: { taskList: newTask._id } });
        if(!updatedProject){
            throw new ApiError(400,"Error Updating User")
        }
    }

    res.status(201).json(new ApiResponse(201,newTask, "Task created successfully" ));
});


const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!isValidObjectId(id)){
        return res.status(404).json( new ApiError(404, "Task not found"));

    }

    // Define the status transitions
    const statusTransitions = {
        "Backlog": "In Discussion",
        "In Discussion": "In Progress",
        "In Progress": "Done"
    };

    // Find the task by ID and get its current status
    const task = await Task.findOne({_id:id,assignedUser:req.user._id});
    if (!task) {
        return res.status(404).json( new ApiError(404, "Task not found"));

    }

    // Determine the next status
    const nextStatus = statusTransitions[task.taskStatus];
    if (!nextStatus) {
        return res.status(404).json( new ApiError(404, "Invalid Status Transition"));

    }

    // Update the task status using the $set operator
    const updatedTask = await Task.findOneAndUpdate(
        { _id: id },
        { $set: { taskStatus: nextStatus } },
        { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200,updatedTask, "Task status updated successfully"));
});



const deleteTask = asyncHandler(async(req,res)=>{
    const { id } = req.params;

    if(!isValidObjectId(id)){
        return res.status(404).json( new ApiError(404, "Task not found"));


    }

    const task = await Task.findOneAndDelete({_id:id,assignedUser:req.user._id});
    if (!task) {
        return res.status(404).json( new ApiError(404, "Task not found"));

    }
    res.status(200).json(new ApiResponse(200,task, "Task deleted successfully"));
})


const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({assignedUser:req.user._id}).populate("project").populate({
        path: 'assignedUser',
        select: '-password' 
    });
    res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});


const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!isValidObjectId(id)){
        return res.status(404).json( new ApiError(404, "Task not found"));
    }

    const task = await Task.findOne({_id:id,assignedUser:req.user._id}).populate("project").populate("assignedUser");
    if (!task) {
        return res.status(404).json( new ApiError(404, "Task not found"));
    }

    res.status(200).json(new ApiResponse(200,task, "Task retrieved successfully"));
});


export {addTask,deleteTask,updateTask,getAllTasks,getTaskById}