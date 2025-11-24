import { JWTPayload } from "../../../shared/types";
export declare class AuthClient {
    private readonly authServiceUrl;
    constructor();
    validateToken(token: string): Promise<JWTPayload>;
}
//# sourceMappingURL=authClient.d.ts.map