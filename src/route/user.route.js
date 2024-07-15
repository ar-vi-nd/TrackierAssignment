import { Router } from "express";
import { userRegister, userSignup } from "../controller/user.controller.js";

const router = Router()

router.route("/")
.get(userRegister)

router.route("/signup").post(userSignup)

export default router