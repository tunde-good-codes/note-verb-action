import { AuthTokens } from "../../../shared/types";
export declare class AuthService {
    private readonly jwtSecret;
    private readonly jwtRefreshSecret;
    private readonly jwtExpiresIn;
    private readonly jwtRefreshExpiresIn;
    private readonly bcryptRounds;
    constructor();
    register(email: string, password: string): Promise<AuthTokens>;
    private generateTokens;
}
//# sourceMappingURL=authService.d.ts.map