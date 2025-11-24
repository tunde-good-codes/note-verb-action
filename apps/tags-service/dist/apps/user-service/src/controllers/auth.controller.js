"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.getProfile = exports.validateTokenSimple = exports.validateToken = exports.logout = exports.refreshTokens = exports.login = exports.register = void 0;
const authService_1 = require("../authService");
const middleware_1 = require("../../../../shared/middleware");
const utils_1 = require("../../../../shared/utils");
const authService = new authService_1.AuthService();
exports.register = (0, middleware_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const tokens = await authService.register(email, password);
    res
        .status(201)
        .json((0, utils_1.createSuccessResponse)(tokens, "User registered successfully"));
});
exports.login = (0, middleware_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const tokens = await authService.login(email, password);
    res
        .status(200)
        .json((0, utils_1.createSuccessResponse)(tokens, "User logged in successfully"));
});
exports.refreshTokens = (0, middleware_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res
        .status(200)
        .json((0, utils_1.createSuccessResponse)(tokens, "Tokens refreshed successfully"));
});
exports.logout = (0, middleware_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res
        .status(200)
        .json((0, utils_1.createSuccessResponse)(null, "User logged out successfully"));
});
exports.validateToken = (0, middleware_1.asyncHandler)(async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json((0, utils_1.createErrorResponse)("No token provided"));
            return;
        }
        const payload = await authService.validateToken(token);
        res.status(200).json((0, utils_1.createSuccessResponse)(payload, "Token is valid"));
    }
    catch (error) {
        throw error;
    }
});
exports.validateTokenSimple = (0, middleware_1.asyncHandler)(async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json((0, utils_1.createErrorResponse)("No token provided"));
        return;
    }
    const payload = await authService.validateToken(token);
    res.status(200).json((0, utils_1.createSuccessResponse)(payload, "Token is valid"));
});
exports.getProfile = (0, middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json((0, utils_1.createErrorResponse)("Unauthorized"));
        return;
    }
    const user = await authService.getUserById(userId);
    if (!user) {
        res.status(404).json((0, utils_1.createErrorResponse)("User not found"));
        return;
    }
    res.status(200).json((0, utils_1.createSuccessResponse)(user, "User profile retrieved"));
});
exports.deleteAccount = (0, middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json((0, utils_1.createErrorResponse)("Unauthorized"));
        return;
    }
    await authService.deleteUser(userId);
    res
        .status(200)
        .json((0, utils_1.createSuccessResponse)(null, "Account deleted successfully"));
});
//# sourceMappingURL=auth.controller.js.map