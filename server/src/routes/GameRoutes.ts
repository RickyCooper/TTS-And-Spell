import { Router } from "express";
import * as AudioController from "../controllers/AudioController";

const router = Router();

router.post("/words", AudioController.gameAudio);
router.post("/context-audio", AudioController.contextAudio);
router.get("/demo", AudioController.demoAudio);

export default router;