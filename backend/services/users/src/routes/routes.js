import { Router } from "express";
import { getLoggedInUser, getUserById, login, logout, refreshToken, Register } from "../controller/user.controller.js";

const router = Router();

router.post("/register",Register);
router.post("/login",login);
router.post("/logout", logout)
router.post("/refresh",refreshToken);
router.get("/profile",getLoggedInUser);

router.get("/:id",getUserById);

export default router;