// src/controllers/authController.ts
import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import Repository from "../models/Repository";
import { sendVerificationEmail } from "../utils/sendEmail";
import { logger } from "../utils/logger";
import { env } from "../config/env";
import mongoose from "mongoose";

// Helper: genera código 2FA
function generateCode6() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: firma JWT app
function signAppJwt(
  payload: Record<string, any>,
  expiresIn: SignOptions["expiresIn"] = "1d",
) {
  // Cast env.JWT_SECRET to Secret to satisfy typings from @types/jsonwebtoken
  return jwt.sign(payload, env.JWT_SECRET as Secret, { expiresIn });
}

/**
 * POST /api/auth/register
 * Crea usuario + repo personal (typeRepo="simple", mode="personal")
 */
export const register: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Todos los campos son obligatorios." });
      return;
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      res.status(400).json({ message: "El usuario o email ya están en uso." });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    // Crear repositorio personal alineado a modelos nuevos
  // newUser._id can be unknown in some mongoose typings; cast to string|ObjectId for safety
  const ownerId = new mongoose.Types.ObjectId(newUser._id as string);
    const personalRepo = await Repository.create({
      name: `Repositorio de ${username}`,
      description: "Repositorio personal del usuario",
      typeRepo: "simple",
      mode: "personal",
      privacy: "private", // personal por defecto privado (ajústalo si quieres público)
      owner: ownerId,
      participants: [{ user: ownerId, role: "owner", status: "active" }],
      files: [],
      tags: [],
    });

    // Vincular repo al usuario
  // personalRepo._id may be typed as unknown; cast to Types.ObjectId before pushing
  newUser.repositories.push(personalRepo._id as mongoose.Types.ObjectId);
    await newUser.save();

  res.status(201).json({ message: "Usuario registrado exitosamente." });
  return;
  } catch (err) {
    logger.error(err);
  res.status(500).json({ message: "Error en el servidor." });
  return;
  }
};

/**
 * POST /api/auth/login
 * 1er paso: valida credenciales, genera código 2FA y devuelve loginId temporal.
 * NO devuelve el JWT final aquí (buena práctica 2FA).
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Usuario y contraseña son requeridos." });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Credenciales inválidas." });
      return;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(400).json({ message: "Credenciales inválidas." });
      return;
    }

    const code = generateCode6();
    const expires = new Date(Date.now() + env.TWOFA_TTL_MIN * 60 * 1000);

    user.verificationCode = code;
    user.verificationCodeExpires = expires;
    await user.save();

    // loginId simple (no-critico): hash efímero para correlacionar el flujo
    const loginId = crypto.randomBytes(16).toString("hex");

    logger.info(`Enviando código 2FA a ${user.email}`);
    await sendVerificationEmail(user.email, code);

    res.json({
      loginId,
      twoFA: true,
      message: "Se envió el código de verificación a tu correo.",
    });
    return;
  } catch (err) {
    logger.error(err);
  res.status(500).json({ message: "Error en el servidor." });
  return;
  }
};

/**
 * POST /api/auth/verify-code
 * 2do paso: valida código y retorna el JWT final.
 */
export const verifyCode: RequestHandler = async (req, res) => {
  try {
    const { username, code } = req.body;
    if (!username || !code) {
      res.status(400).json({ message: "Datos incompletos." });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Usuario no encontrado." });
      return;
    }

    if (user.verificationCode !== code) {
  res.status(400).json({ message: "Código inválido." });
  return;
    }

    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
  res.status(400).json({ message: "El código ha expirado." });
  return;
    }

    // OK => genera JWT
    const token = signAppJwt({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      // role: user.userType, // si decides firmar el rol
    });

    // Limpia 2FA
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
    return;
  } catch (err) {
    logger.error(err);
  res.status(500).json({ message: "Error en el servidor." });
  return;
  }
};
