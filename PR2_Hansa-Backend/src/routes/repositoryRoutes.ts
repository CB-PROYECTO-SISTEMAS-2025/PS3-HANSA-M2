import express from "express";
import { verifyToken } from "../middleware/auth";
import {
  createRepository,
  getMyRepositories,
  getFilesByRepository,
  deleteRepository,
  getPublicRepositories,
  getRepositoryById,
} from "../controllers/repositoryController";

const router = express.Router();

// Crear
router.post("/", verifyToken, createRepository);

// Mis repos (owner o miembro)
router.get("/mis-repositorios", verifyToken, getMyRepositories);

// Archivos (vista rápida por GridFS; opcional)
router.get("/repositorio/:id", verifyToken, getFilesByRepository);
// Repositorio por ID
router.get("/:id", verifyToken, getRepositoryById);

// Eliminar (solo owner)
router.delete("/:id", verifyToken, deleteRepository);

// Públicos (simple público + creator vitrina)
router.get("/publicos", getPublicRepositories);

/* Si prefieres inglés:
router.post("/", verifyToken, createRepository);
router.get("/mine", verifyToken, getMyRepositories);
router.get("/:id/files", verifyToken, getFilesByRepository);
router.delete("/:id", verifyToken, deleteRepository);
router.get("/", getPublicRepositories);
*/

export default router;
