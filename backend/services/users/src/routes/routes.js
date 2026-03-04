import { Router } from "express";
import { getUserById, login, logout, refreshToken, Register } from "../controller/user.controller.js";

const router = Router();

router.post("/register",Register);
router.post("/login",login);
router.post("/logout", logout)
router.post("/refresh",refreshToken);
router.get("/:id",getUserById);

export default router;