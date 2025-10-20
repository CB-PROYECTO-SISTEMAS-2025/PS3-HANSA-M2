// src/controllers/invitationController.ts
import { Request, Response } from "express";
import Invitation from "../models/Invitation";
import Repository from "../models/Repository";
import User from "../models/User";
import mongoose from "mongoose";

export const inviteToSimpleRepo = async (req: Request, res: Response) => {
  const repoId = req.params.id;
  const { email, role } = req.body; // role: admin|writer|viewer
  const inviterId = new mongoose.Types.ObjectId((req as any).user.id);

  const repo = await Repository.findById(repoId);
  if (!repo || repo.typeRepo !== "simple") {
    res.status(400).json({ message: "Repo no válido" });
    return;
  }
  if (!repo.owner.equals(inviterId)) {
    res.status(403).json({ message: "Solo el owner invita" });
    return;
  }

  const invited = await User.findOne({ email });
  if (!invited) {
    res.status(400).json({ message: "Usuario no registrado" });
    return;
  }

  const token = new mongoose.Types.ObjectId().toHexString();
  const inv = await Invitation.create({
    repo: repo._id,
    invitedUser: invited._id,
    invitedBy: inviterId,
    role,
    token,
    status: "pending",
  });

  // (Opcional: enviar email con token)
  res.status(201).json({ message: "Invitación creada", invitation: inv });
  return;
};

export const acceptInvitation = async (req: Request, res: Response) => {
  const { token } = req.body;
  const userId = new mongoose.Types.ObjectId((req as any).user.id);

  const inv = await Invitation.findOne({ token, invitedUser: userId, status: "pending" });
  if (!inv) {
    res.status(400).json({ message: "Invitación inválida" });
    return;
  }

  const repo = await Repository.findById(inv.repo);
  if (!repo) {
    res.status(404).json({ message: "Repositorio no encontrado" });
    return;
  }

  const exists = repo.participants.some((p: any) => (p.user as any).equals(userId));
  if (!exists) repo.participants.push({ user: userId, role: inv.role, status: "active" } as any);
  await repo.save();

  inv.status = "accepted";
  await inv.save();

  res.status(200).json({ message: "Has ingresado al repositorio" });
  return;
};
