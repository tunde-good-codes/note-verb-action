import express, { Router } from "express";
import { userRegistration, verifyUser } from "../controllers/auth.controller.js";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);

export default router;
