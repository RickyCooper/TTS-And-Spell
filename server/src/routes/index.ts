import { Router } from "express";
import { WordAudioController } from "../controllers/WordAudioController";
import authRoutes from "./AuthRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.post("/words", WordAudioController);

export default router;
