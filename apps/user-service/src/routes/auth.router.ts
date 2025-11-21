
import { loginSchema, refreshTokenSchema, registerSchema } from "../validation";
import { authenticateToken, validateRequest } from "../../../../shared/middleware";
import { Router } from "express";
import { deleteAccount, getProfile, login, logout, refreshTokens, register, validateToken } from "../controllers/auth.controller";

const router = Router();

//public routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", validateRequest(refreshTokenSchema), refreshTokens);
router.post("/logout", validateRequest(refreshTokenSchema), logout);

// Token validation endpoint ( for other services to validate tokens )
router.post("/validate", validateToken);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.delete("/profile", authenticateToken, deleteAccount);

export default router;
