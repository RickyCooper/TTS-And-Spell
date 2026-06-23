import { Router } from "express";
import * as AudioController from "../controllers/AudioController";

const router = Router();

router.post("/words", AudioController.gameAudio);
router.get("/demo", AudioController.demoAudio);

export default router;