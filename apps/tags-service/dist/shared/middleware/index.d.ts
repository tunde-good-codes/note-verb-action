import { Request, Response, NextFunction } from "express";
import { JWTPayload, ServiceError } from "../types";
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): void;
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateRequest(schema: any): (req: Request, res: Response, next: NextFunction) => void;
export declare function errorHandler(error: ServiceError, req: Request, res: Response, next: NextFunction): void;
export declare function corsOptions(): {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    maxAge: number;
};
export declare function rateLimitMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
export declare function healthCheck(req: Request, res: Response): void;
export declare function notFoundHandler(req: Request, res: Response): void;
export declare function requestLogger(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=index.d.ts.map