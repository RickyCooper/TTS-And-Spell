import { Router } from "express";
import authRoutes from "./AuthRoutes";
import gameRoutes from "./GameRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/game", gameRoutes);

export default router;
