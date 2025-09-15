// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Repository from '../models/Repository';
import { sendVerificationEmail } from '../utils/sendEmail';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      return; // evita seguir ejecutando
    }

    // ✅ US-03: contraseña fuerte (≥12, mayúscula, minúscula, número y símbolo)
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;
    if (!strong.test(password)) {
      res.status(422).json({
        message: 'Contraseña débil: usa ≥12 caracteres, mayúscula, minúscula, número y símbolo.',
      });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'El usuario o email ya están en uso.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // 👇 Crear el repositorio personal del usuario (tu lógica)
    const personalRepo = new Repository({
      name: `Repositorio de ${username}`,
      description: 'Repositorio personal del usuario',
      type: 'personal',
      linkedToUser: newUser._id,
      owner: newUser._id,
      members: [newUser._id],
      files: [],
    });

    await personalRepo.save();

    // 👇 Vincular el repositorio al usuario (tu lógica)
    newUser.repositories.push(personalRepo._id as (typeof newUser.repositories)[0]);
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    // Crear código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // Código válido 10 minutos

    // Guardar en el usuario
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = expires;
    await user.save();

    // Enviar el correo
    logger.error('Enviando correo...');
    logger.error(user.email, verificationCode);
    await sendVerificationEmail(user.email, verificationCode);
    logger.error(verificationCode);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error en el servidorakjshfdkshfa.' });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const { username, code } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    if (user.verificationCode !== code) {
      res.status(400).json({ message: 'Código inválido.' });
    }

    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      res.status(400).json({ message: 'El código ha expirado.' });
    }

    // Código correcto → Generamos JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    // Limpiar el código de verificación
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// reenvio de codigo de 2 pasos

export const resendCode = async (req: Request, res: Response) => {
  try {
    const { username } = req.body as { username?: string };
    // Siempre responder 200 aunque falte username para no filtrar info
    if (!username) {
      res.status(200).json({ ok: true });
      return;
    }

    const user = await User.findOne({ username });
    // Igual, no revelar existencia
    if (!user) {
      res.status(200).json({ ok: true });
      return;
    }

    // Generar nuevo código y fecha de expiración
    const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
    const ttlMin = Number(process.env.TWOFA_TTL_MIN || 5); // 5 minutos por defecto
    const expires = new Date(Date.now() + ttlMin * 60 * 1000);

    user.verificationCode = code;
    user.verificationCodeExpires = expires;
    await user.save();

    try {
      await sendVerificationEmail(user.email, code);
    } catch (e) {
      // No romper flujo por falla de SMTP; igual devolvemos ok (para no filtrar info)
      console.error("Error enviando verificación 2FA:", e);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    // Igual devolvemos 200 para no revelar nada en este flujo
    res.status(200).json({ ok: true });
  }
};
