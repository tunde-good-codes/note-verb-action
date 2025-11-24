"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserProfile_1 = __importDefault(require("./models/UserProfile"));
const RefreshToken_1 = __importDefault(require("./models/RefreshToken"));
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../shared/utils");
class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
        this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
        this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
        if (!this.jwtSecret || !this.jwtRefreshSecret) {
            throw new Error("JWT secrets are not defined in environment variables");
        }
    }
    async register(email, password) {
        try {
            const existingUser = await UserProfile_1.default.findOne({ email });
            if (existingUser) {
                throw (0, utils_1.createServiceError)("User already exists", 409);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, this.bcryptRounds);
            const user = await UserProfile_1.default.create({
                email,
                password: hashedPassword,
            });
            return this.generateTokens(user._id.toString(), user.email);
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("User already exists")) {
                throw error;
            }
            throw (0, utils_1.createServiceError)("Registration failed", 500, error);
        }
    }
    async generateTokens(userId, email) {
        const payload = { userId, email };
        const accessTokenOptions = {
            expiresIn: this.jwtExpiresIn,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, this.jwtSecret, accessTokenOptions);
        const refreshTokenOptions = {
            expiresIn: this.jwtRefreshExpiresIn,
        };
        const refreshToken = jsonwebtoken_1.default.sign(payload, this.jwtRefreshSecret, refreshTokenOptions);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await RefreshToken_1.default.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            token: refreshToken,
            expiresAt,
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async login(email, password) {
        try {
            const user = await UserProfile_1.default.findOne({ email }).select("+password");
            if (!user) {
                throw (0, utils_1.createServiceError)("Invalid email or password", 401);
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw (0, utils_1.createServiceError)("Invalid email or password", 401);
            }
            return this.generateTokens(user._id.toString(), user.email);
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("Invalid email or password")) {
                throw error;
            }
            throw (0, utils_1.createServiceError)("Login failed", 500, error);
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, this.jwtRefreshSecret);
            const storedToken = await RefreshToken_1.default.findOne({
                token: refreshToken,
            }).populate("userId");
            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw (0, utils_1.createServiceError)("Invalid or expired refresh token", 401);
            }
            const tokens = await this.generateTokens(storedToken.userId._id.toString(), storedToken.userId.email);
            await RefreshToken_1.default.findByIdAndDelete(storedToken._id);
            return tokens;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw (0, utils_1.createServiceError)("Invalid refresh token", 401);
            }
            if (error instanceof Error &&
                error.message.includes("Invalid or expired refresh token")) {
                throw error;
            }
            throw (0, utils_1.createServiceError)("Token refresh failed", 500, error);
        }
    }
    async logout(refreshToken) {
        try {
            await RefreshToken_1.default.findOneAndDelete({ token: refreshToken });
        }
        catch (error) {
            throw (0, utils_1.createServiceError)("Logout failed", 500, error);
        }
    }
    async logoutAll(userId) {
        try {
            await RefreshToken_1.default.deleteMany({ userId: new mongoose_1.Types.ObjectId(userId) });
        }
        catch (error) {
            throw (0, utils_1.createServiceError)("Logout all failed", 500, error);
        }
    }
    async validateToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            const user = await UserProfile_1.default.findById(decoded.userId);
            if (!user) {
                throw (0, utils_1.createServiceError)("User not found", 404);
            }
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw (0, utils_1.createServiceError)("Invalid token", 401);
            }
            if (error instanceof Error && error.message.includes("User not found")) {
                throw error;
            }
            throw (0, utils_1.createServiceError)("Token validation failed", 500, error);
        }
    }
    async getUserById(userId) {
        try {
            const user = await UserProfile_1.default.findById(userId).select("-password");
            if (!user) {
                throw (0, utils_1.createServiceError)("User not found", 404);
            }
            return user;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("User not found")) {
                throw error;
            }
            throw (0, utils_1.createServiceError)("Failed to get user", 500, error);
        }
    }
    async deleteUser(userId) {
        try {
            await Promise.all([
                UserProfile_1.default.findByIdAndDelete(userId),
                RefreshToken_1.default.deleteMany({ userId: new mongoose_1.Types.ObjectId(userId) }),
            ]);
        }
        catch (error) {
            throw (0, utils_1.createServiceError)("Failed to delete user", 500, error);
        }
    }
    async cleanupExpiredTokens() {
        try {
            await RefreshToken_1.default.deleteMany({ expiresAt: { $lt: new Date() } });
        }
        catch (error) {
            console.error("Cleanup expired tokens failed:", error);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map