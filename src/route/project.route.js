import {Router} from "express"
import { addProject,deleteProject,updateProject,getAllProjects,getProjectById } from "../controller/project.controller.js"

const router = Router()

router.route("/").post(addProject)
router.route("/:id").delete(deleteProject)
router.route("/:id").patch(updateProject)
router.route("/").get(getAllProjects)
router.route("/:id").get(getProjectById)

export default router