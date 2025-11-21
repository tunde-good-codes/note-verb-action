"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileSchema = exports.updateProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(1).max(50).optional().messages({
        "string.min": "First name must be at least 1 character long",
        "string.max": "First name must not exceed 50 characters",
    }),
    lastName: joi_1.default.string().min(1).max(50).optional().messages({
        "string.min": "Last name must be at least 1 character long",
        "string.max": "Last name must not exceed 50 characters",
    }),
    bio: joi_1.default.string().max(500).optional().allow("").messages({
        "string.max": "Bio must not exceed 500 characters",
    }),
    avatarUrl: joi_1.default.string().uri().optional().allow("").messages({
        "string.uri": "Avatar URL must be a valid URL",
    }),
    preferences: joi_1.default.object().optional().messages({
        "object.base": "Preferences must be a valid object",
    }),
});
exports.createProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(1).max(50).optional().messages({
        "string.min": "First name must be at least 1 character long",
        "string.max": "First name must not exceed 50 characters",
    }),
    lastName: joi_1.default.string().min(1).max(50).optional().messages({
        "string.min": "Last name must be at least 1 character long",
        "string.max": "Last name must not exceed 50 characters",
    }),
    bio: joi_1.default.string().max(500).optional().allow("").messages({
        "string.max": "Bio must not exceed 500 characters",
    }),
    avatarUrl: joi_1.default.string().uri().optional().allow("").messages({
        "string.uri": "Avatar URL must be a valid URL",
    }),
    preferences: joi_1.default.object().optional().default({}).messages({
        "object.base": "Preferences must be a valid object",
    }),
});
//# sourceMappingURL=validation.js.map