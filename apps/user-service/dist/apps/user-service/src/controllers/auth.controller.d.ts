import { Request, Response } from "express";
export declare const register: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const refreshTokens: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const validateToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const validateTokenSimple: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteAccount: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=auth.controller.d.ts.map