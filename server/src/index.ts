import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});