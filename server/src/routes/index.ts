import { Router } from "express";
import { WordAudioController } from "../controllers/WordAudioController";

const router = Router();

router.post("/words", WordAudioController);

export default router;
