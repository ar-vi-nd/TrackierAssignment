import { Router } from "express";
import { userRegister, userSignup ,userLogin, userLogout} from "../controller/user.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/")
.get(userRegister)

router.route("/signup").post(userSignup)
router.route("/login").post(userLogin)
router.route("/logout").get(verifyjwt,userLogout)

export default router