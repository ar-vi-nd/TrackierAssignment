import mongoose,{Schema} from "mongoose";

const projectSchema = new Schema({
    projectName : {
        type: String,
        required : true,
        unique : true
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
})

const Project = mongoose.model("Project",projectSchema)

export default Project