"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const utils_1 = require("../../../shared/utils");
const axios_1 = __importDefault(require("axios"));
class AuthClient {
    constructor() {
        this.authServiceUrl =
            process.env.AUTH_SERVICE_URL || "http://localhost:8081";
    }
    async validateToken(token) {
        try {
            const response = await axios_1.default.post(`${this.authServiceUrl}/auth/validate`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 5000,
            });
            if (!response.data.success || !response.data.data) {
                throw (0, utils_1.createServiceError)("Invalid token response from auth service", 401);
            }
            return response.data.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw (0, utils_1.createServiceError)("Invalid or expired token", 401);
            }
            if (error.code === "ECONNRREFUSED") {
                throw (0, utils_1.createServiceError)("Auth service is unavailable", 503);
            }
            throw (0, utils_1.createServiceError)("An unexpected error occurred", 500);
        }
    }
}
exports.AuthClient = AuthClient;
//# sourceMappingURL=authClient.js.map