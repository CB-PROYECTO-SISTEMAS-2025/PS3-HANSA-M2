// src/routes/authRoutes.ts
import express from 'express';
import { register, login, verifyCode, resendCode } from '../controllers/authController';
import { rateLimitResend } from '../middleware/rateLimitResend';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verifyCode', verifyCode);
//router.post('/verifyCode/resend', resendCode); // ⬅️ NUEVO
router.post('/verifyCode/resend', rateLimitResend, resendCode); // ⬅️ con rate limit

export default router;
