"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const router = express_1.default.Router();
router.post("/user-registration", auth_controller_js_1.userRegistration);
router.post("/verify-user", auth_controller_js_1.verifyUser);
exports.default = router;
//# sourceMappingURL=auth.router.js.map