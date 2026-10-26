import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, VerifyResetCodeSchema, ResetPasswordSchema } from "../types/AuthTypes";

const router = Router();

router.post("/register", validate(RegisterSchema), AuthController.register);
router.post("/login", validate(LoginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", authenticate, AuthController.me);
router.post("/forgot-password", validate(ForgotPasswordSchema), AuthController.forgotPassword);
router.post("/verify-reset-code", validate(VerifyResetCodeSchema), AuthController.verifyResetCode);
router.post("/reset-password", validate(ResetPasswordSchema), AuthController.resetPassword);

export default router;
