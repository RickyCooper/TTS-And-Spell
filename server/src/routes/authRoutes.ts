import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { RegisterSchema, LoginSchema } from "../types/AuthTypes";

const router = Router();

router.post("/register", validate(RegisterSchema), AuthController.register);
router.post("/login", validate(LoginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", authenticate, AuthController.me);

export default router;
