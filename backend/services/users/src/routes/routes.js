import { Router } from "express";
import { login, logout, refreshToken, Register } from "../controller/user.controller.js";

const router = Router();

router.post("/register",Register);
router.post("/login",login);
router.post("/logout", logout)
router.post("/refresh",refreshToken);

export default router;