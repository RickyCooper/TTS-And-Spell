import { z } from "zod";
import { config } from "../config";

const MAX_WORDS_PER_AUDIO_REQUEST = 20;

// an omitted voice falls back to the configured default; anything else must be an allowed voice
const VoiceIdSchema = z
  .string()
  .refine((voiceId) => config.allowedVoiceIds.includes(voiceId), "Unsupported voice.")
  .default(config.voiceId);

// the remaining keys are difficulty -> word count
export const GameWordsSchema = z.looseObject({ voiceId: VoiceIdSchema }).refine(
  ({ voiceId, ...difficulties }) =>
    Object.values(difficulties).every(
      (count) => Number.isInteger(count) && Number(count) >= 1 && Number(count) <= MAX_WORDS_PER_AUDIO_REQUEST,
    ),
  `Word counts must be whole numbers from 1 to ${MAX_WORDS_PER_AUDIO_REQUEST}.`,
);

export const ContextAudioSchema = z.object({
  word: z.string(),
  contextType: z.enum(["sentence", "definition"]),
  voiceId: VoiceIdSchema,
});

export const WordAudioSchema = z.object({
  words: z.array(z.string()).min(1, "A list of words is required.").max(MAX_WORDS_PER_AUDIO_REQUEST),
  voiceId: VoiceIdSchema,
});

export const VoicePreviewSchema = z.object({ voiceId: VoiceIdSchema });

export const DemoQuerySchema = z.object({
  count: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_WORDS_PER_AUDIO_REQUEST, `Count must be a whole number from 1 to ${MAX_WORDS_PER_AUDIO_REQUEST}.`)
    .optional(),
});

export type GameWordsInput = z.infer<typeof GameWordsSchema>;
export type ContextAudioInput = z.infer<typeof ContextAudioSchema>;
export type WordAudioInput = z.infer<typeof WordAudioSchema>;
export type VoicePreviewInput = z.infer<typeof VoicePreviewSchema>;
export type DemoQueryInput = z.infer<typeof DemoQuerySchema>;
