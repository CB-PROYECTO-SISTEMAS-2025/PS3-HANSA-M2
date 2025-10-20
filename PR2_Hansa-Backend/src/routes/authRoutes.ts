import express from "express";
import { register, login, verifyCode } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// estandariza snake-case en endpoint
router.post("/verify-code", verifyCode);

export default router;
