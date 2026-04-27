import { Router } from "express";
import { getLoggedInUser, getUserById, login, logout, refreshToken, Register } from "../controller/user.controller.js";

const router = Router();

router.post("/register",Register);
router.post("/login",login);
router.post("/logout", logout)  //protected
router.post("/refresh",refreshToken); //protected
router.get("/profile/my",getLoggedInUser); //protected

router.get("/:id",getUserById);

export default router;