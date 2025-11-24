"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../validation");
const middleware_1 = require("../../../../shared/middleware");
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post("/register", (0, middleware_1.validateRequest)(validation_1.registerSchema), auth_controller_1.register);
router.post("/login", (0, middleware_1.validateRequest)(validation_1.loginSchema), auth_controller_1.login);
router.post("/refresh", (0, middleware_1.validateRequest)(validation_1.refreshTokenSchema), auth_controller_1.refreshTokens);
router.post("/logout", (0, middleware_1.validateRequest)(validation_1.refreshTokenSchema), auth_controller_1.logout);
router.post("/validate", auth_controller_1.validateToken);
router.get("/profile", middleware_1.authenticateToken, auth_controller_1.getProfile);
router.delete("/profile", middleware_1.authenticateToken, auth_controller_1.deleteAccount);
exports.default = router;
//# sourceMappingURL=auth.router.js.map