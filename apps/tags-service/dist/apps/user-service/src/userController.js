"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.getProfile = void 0;
const middleware_1 = require("../../../shared/middleware");
const userService_1 = require("./userService");
const utils_1 = require("../../../shared/utils");
const userService = new userService_1.UserService();
exports.getProfile = (0, middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json((0, utils_1.createErrorResponse)("User not authenticated"));
    }
    const profile = await userService.getProfile(userId);
    return res
        .status(200)
        .json((0, utils_1.createSuccessResponse)(profile, "User profile retrieved successfully"));
});
exports.updateProfile = (0, middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res
            .status(401)
            .json((0, utils_1.createErrorResponse)("User not authenticated"));
    }
    const profile = await userService.updateProfile(userId, req.body);
    return res
        .status(200)
        .json((0, utils_1.createSuccessResponse)(profile, "User profile updated successfully"));
});
exports.deleteProfile = (0, middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res
            .status(401)
            .json((0, utils_1.createErrorResponse)("User not authenticated"));
    }
    await userService.deleteProfile(userId);
    return res.status(204).send();
});
//# sourceMappingURL=userController.js.map