import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { config } from "../config";

const apiKey = config.elevenLabsApiKey;

export interface WordWithAudio {
  text: string;
  audio: string;
}

let elevenlabsClient: ElevenLabsClient | null = null;

const getClient = () => {
  if (!elevenlabsClient && apiKey) {
    elevenlabsClient = new ElevenLabsClient({
      apiKey: apiKey,
    });
  }
  return elevenlabsClient;
};

export const generateSingleWordAudio = async (word: string, voiceId: string): Promise<Buffer> => {
  const client = getClient();

  if (!client) {
    throw new Error("ElevenLabs client is not initialized. Please check your API key configuration.");
  }

  const audioData = await client.textToSpeech.convert(voiceId, {
    text: word,
    modelId: "eleven_turbo_v2_5",
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioData as any) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

