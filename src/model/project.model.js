import mongoose,{Schema} from "mongoose";

const projectSchema = new Schema({
    projectName : {
        type: String,
        required : true,
    },
    projectDescription :{
        type : String,
        required : true
    },
    projectUser : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    taskList : [
        {type: Schema.Types.ObjectId,
        ref : "Task"}
    ]
},{timestamps:true})

const Project = mongoose.model("Project",projectSchema)

export default Project