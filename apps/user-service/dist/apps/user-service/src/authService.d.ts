import { AuthTokens, JWTPayload } from "../../../shared/types";
export declare class AuthService {
    private readonly jwtSecret;
    private readonly jwtRefreshSecret;
    private readonly jwtExpiresIn;
    private readonly jwtRefreshExpiresIn;
    private readonly bcryptRounds;
    constructor();
    register(email: string, password: string): Promise<AuthTokens>;
    private generateTokens;
    login(email: string, password: string): Promise<AuthTokens>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    logout(refreshToken: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    validateToken(token: string): Promise<JWTPayload>;
    getUserById(userId: string): Promise<any>;
    deleteUser(userId: string): Promise<void>;
    cleanupExpiredTokens(): Promise<void>;
}
//# sourceMappingURL=authService.d.ts.map