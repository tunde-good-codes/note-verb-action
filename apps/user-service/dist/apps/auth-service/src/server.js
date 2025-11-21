"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./utils/db"));
const app = (0, express_1.default)();
dotenv_1.default.config();
(0, db_1.default)();
app.use((0, cookie_parser_1.default)());
app.get("/api", (req, res) => {
    res.send({ message: "Welcome to auth-service!!" });
});
app.get("/auth", (req, res) => {
    res.json({
        message: "Auth service is working via gateway!",
        success: true,
        timestamp: new Date().toISOString(),
    });
});
app.get("/", (req, res) => {
    res.json({
        message: "auth-service is here",
        success: true,
    });
});
const PORT = process.env.AUTH_SERVICE_PORT || 8081;
const server = app.listen(PORT, () => {
    console.log(`Auth Service listening at http://localhost:${PORT}/api`);
    console.log(`Swagger Service listening at http://localhost:${PORT}/docs`);
});
server.on("error", console.error);
//# sourceMappingURL=server.js.map