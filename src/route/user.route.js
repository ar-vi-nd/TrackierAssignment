import { Router } from "express";
import { userRegister } from "../controller/user.controller.js";

const router = Router()

router.route("/")
.get(userRegister)

router.route("/signup",)

export default router