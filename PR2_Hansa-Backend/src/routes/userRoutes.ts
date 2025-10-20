import express from "express";
import User from "../models/User";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Actualizar perfil (solo el dueño del perfil)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const requesterId = (req as any).user.id;
    if (requesterId !== req.params.id) {
      res.status(403).json({ error: "No autorizado para actualizar este perfil" });
      return;
    }

    const payload = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      bio: req.body.bio,
      isPublic: req.body.isPublic,
      userType: req.body.userType,
      student: req.body.student,
      researcher: req.body.researcher,
      businessAdmin: req.body.businessAdmin,
      academic: req.body.academic,
      hobbies: req.body.hobbies,
      profileStyles: req.body.profileStyles,
      profileImage: req.body.profileImage,
      // compat
      estado: req.body.estado,
      profesion: req.body.profesion,
      institucion: req.body.institucion,
      ciudad: req.body.ciudad,
      contacto: req.body.contacto,
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true });

    if (!updatedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(updatedUser);
    return;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error al actualizar el perfil" });
    return;
  }
});

// Obtener perfil (respeta privacidad en frontend consumiendo isPublic)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener el perfil" });
    return;
  }
});

export default router;
