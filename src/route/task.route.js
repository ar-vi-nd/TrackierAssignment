import {Router} from "express"
import { addTask,updateTask,deleteTask,getAllTasks,getTaskById } from "../controller/task.controller.js" 

const router = Router()

router.route("/").post(addTask)
router.route("/:id").delete(deleteTask)
router.route("/:id").patch(updateTask)
router.route("/").get(getAllTasks)
router.route("/:id").get(getTaskById)

export default router