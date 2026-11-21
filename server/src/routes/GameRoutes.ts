import { Router } from "express";
import * as AudioController from "../controllers/AudioController";
import { validate } from "../middleware/validate";
import {
  GameWordsSchema,
  ContextAudioSchema,
  WordAudioSchema,
  VoicePreviewSchema,
  DemoQuerySchema,
} from "../types/GameTypes";

const router = Router();

router.post("/words", validate(GameWordsSchema), AudioController.gameAudio);
router.post("/context-audio", validate(ContextAudioSchema), AudioController.contextAudio);
router.post("/word-audio", validate(WordAudioSchema), AudioController.wordAudio);
router.post("/voice-preview", validate(VoicePreviewSchema), AudioController.voicePreview);
router.get("/demo", validate(DemoQuerySchema, "query"), AudioController.demoAudio);

export default router;