import { AuthService } from "../authService";
import { asyncHandler } from "../../../../shared/middleware";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../../shared/utils";
import { Request, Response } from "express";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.register(email, password);

  res
    .status(201)
    .json(createSuccessResponse(tokens, "User registered successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.login(email, password);

  res
    .status(200)
    .json(createSuccessResponse(tokens, "User logged in successfully"));
});

export const refreshTokens = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);

    res
      .status(200)
      .json(createSuccessResponse(tokens, "Tokens refreshed successfully"));
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);

  res
    .status(200)
    .json(createSuccessResponse(null, "User logged out successfully"));
});

export const validateToken = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json(createErrorResponse("No token provided"));
        return;
      }

      const payload = await authService.validateToken(token);
      res.status(200).json(createSuccessResponse(payload, "Token is valid"));
    } catch (error) {
      // Let the asyncHandler catch and handle this error
      throw error;
    }
  }
);

// Alternative simpler version without try-catch:
export const validateTokenSimple = asyncHandler(
  async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json(createErrorResponse("No token provided"));
      return;
    }

    const payload = await authService.validateToken(token);
    res.status(200).json(createSuccessResponse(payload, "Token is valid"));
  }
);

// Uncommented and fixed profile endpoints:
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json(createErrorResponse("Unauthorized"));
    return;
  }

  const user = await authService.getUserById(userId);

  if (!user) {
    res.status(404).json(createErrorResponse("User not found"));
    return;
  }

  res.status(200).json(createSuccessResponse(user, "User profile retrieved"));
});

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(createErrorResponse("Unauthorized"));
      return;
    }

    await authService.deleteUser(userId);
    res
      .status(200)
      .json(createSuccessResponse(null, "Account deleted successfully"));
  }
);
