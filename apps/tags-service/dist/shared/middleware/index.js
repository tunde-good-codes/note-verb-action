"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.asyncHandler = asyncHandler;
exports.validateRequest = validateRequest;
exports.errorHandler = errorHandler;
exports.corsOptions = corsOptions;
exports.rateLimitMiddleware = rateLimitMiddleware;
exports.healthCheck = healthCheck;
exports.notFoundHandler = notFoundHandler;
exports.requestLogger = requestLogger;
const types_1 = require("../types");
const utils_1 = require("../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json((0, utils_1.createErrorResponse)("Access token required"));
        return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        (0, types_1.logError)(new Error("JWT_SECRET is not defined"));
        res.status(500).json((0, utils_1.createErrorResponse)("Internal Server Error"));
        return;
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            res.status(403).json((0, utils_1.createErrorResponse)("Invalid token"));
            return;
        }
        req.user = decoded;
        next();
    });
}
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
function validateRequest(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const errors = {};
            error.details.forEach((detail) => {
                const field = detail.path.join(".");
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field].push(detail.message);
            });
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors,
            });
            return;
        }
        next();
    };
}
function errorHandler(error, req, res, next) {
    (0, types_1.logError)(error, {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user?.userId || 'unknown'
    });
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? "Internal Server Error" : error.message;
    const responseMessage = process.env.NODE_ENV === 'production' && statusCode === 500
        ? "Internal Server Error"
        : message;
    res.status(statusCode).json((0, utils_1.createErrorResponse)(responseMessage));
}
function corsOptions() {
    const origins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : ["http://localhost:3000"];
    return {
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (origins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: process.env.CORS_CREDENTIALS === "true",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        exposedHeaders: ["Authorization"],
        maxAge: 86400
    };
}
function rateLimitMiddleware() {
    const rateLimitMap = new Map();
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress;
        const windowMs = 15 * 60 * 1000;
        const maxRequests = 100;
        if (!ip) {
            next();
            return;
        }
        const now = Date.now();
        const windowStart = rateLimitMap.get(ip)?.windowStart || now;
        const requestCount = rateLimitMap.get(ip)?.count || 0;
        if (now - windowStart > windowMs) {
            rateLimitMap.set(ip, { count: 1, windowStart: now });
            next();
            return;
        }
        if (requestCount >= maxRequests) {
            res.status(429).json((0, utils_1.createErrorResponse)("Too many requests"));
            return;
        }
        rateLimitMap.set(ip, { count: requestCount + 1, windowStart });
        next();
    };
}
function healthCheck(req, res) {
    const health = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || "1.0.0"
    };
    res.json(health);
}
function notFoundHandler(req, res) {
    res.status(404).json((0, utils_1.createErrorResponse)("Route not found"));
}
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
}
//# sourceMappingURL=index.js.map