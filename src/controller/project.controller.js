import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import Project from "../model/project.model.js";
import { isValidObjectId } from "mongoose";



const addProject = asyncHandler(async(req,res)=>{
    const { projectName, projectDescription } = req.body;

    const existingProject = await Project.findOne({projectName,projectUser:req.user._id});
    if (existingProject) {
        // throw new ApiError(400, "Project name already exists");
       return res.status(400).json(new ApiError(400, "Project name already exists"));

    }

    const newProject = await Project.create({
        projectName,
        projectDescription,
        projectUser: req.user._id,
    })
    res.status(201).json(new ApiResponse(201,newProject, "Project created successfully"));

})
const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
        return res.status(400).json(new ApiError(404, "Project not found or you are not authorized to delete this project"));
    }

    const project = await Project.findOne({ _id: id, projectUser: req.user._id });
    
    if (!project) {
        return res.status(400).json(new ApiError(404, "Project not found or you are not authorized to delete this project"));
    }

    await Task.deleteMany({ _id: { $in: project.taskList } });

    await Project.findOneAndDelete({ _id: id, projectUser: req.user._id });

    return res.status(200).json(new ApiResponse(200, project, "Project and associated tasks deleted successfully"));
});


const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { projectName, projectDescription } = req.body;

    if(!isValidObjectId(id)){
        return res.status(400).json(new ApiError(404, "Project not found or you are not authorized to update this project"));
    }

    const project = await Project.findOneAndUpdate(
        { _id: id, projectUser: req.user._id },
        {
            $set: {
                projectName,
                projectDescription,
            }
        },
        { new: true}
    );

    if (!project) {
        return res.status(400).json(new ApiError(404, "Project not found or you are not authorized to update this project"));
    }

    return res.status(200).json(new ApiResponse(200, project,"Project updated successfully"));
});

const getAllProjects = asyncHandler(async(req,res)=>{
    const projects = await Project.find({ projectUser: req.user._id }).populate("projectUser").populate("taskList");
    res.status(200).json(new ApiResponse(200, projects,"Projects retrieved successfully"));    
})
const getProjectById = asyncHandler(async(req,res)=>{

    const { id } = req.params;

    if(!isValidObjectId(id)){
        return res.status(400).json( new ApiError(404, "Project not found or you are not authorized to view this project"));

    }

    const project = await Project.findOne({ _id: id, projectUser: req.user._id }).populate("projectUser").populate("taskList");
    if (!project) {
        return res.status(400).json( new ApiError(404, "Project not found or you are not authorized to view this project"));
    }

    res.status(200).json(new ApiResponse(200,  project,"Project retrieved successfully"));

    
})

export {addProject,deleteProject,updateProject,getAllProjects,getProjectById}