import express from "express";
import cors from "cors";
import { config } from "./config";
import routes from "./routes";

const app = express();

if (!process.env.ELEVEN_LABS_API_KEY) {
  console.warn("WARNING: ELEVEN_LABS_API_KEY is not set in .env file.");
} else {
  console.log("SUCCESS: ElevenLabs API key is set in .env file.");
}

app.use(cors());

app.use(express.json());

app.use("/", routes);

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});