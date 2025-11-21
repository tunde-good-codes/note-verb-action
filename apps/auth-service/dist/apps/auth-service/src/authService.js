"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const utils_1 = require("@shared/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./models/User"));
const RefreshToken_1 = __importDefault(require("./models/RefreshToken"));
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
        const existingUser = await User_1.default.findOne({
            where: { email },
        });
        if (existingUser) {
            throw (0, utils_1.createServiceError)("User already exists", 409);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, this.bcryptRounds);
        const user = await User_1.default.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        return this.generateTokens(user.id, user.email);
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
            data: {
                userId,
                token: refreshToken,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map