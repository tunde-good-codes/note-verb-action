"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.userRegistration = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_helper_js_1 = require("../utils/auth.helper.js");
const index_js_1 = require("@shared/error-handler/index.js");
const User_js_1 = __importDefault(require("../models/User.js"));
const userRegistration = async (req, res, next) => {
    try {
        (0, auth_helper_js_1.validateRegistrationData)(req.body, "user");
        const { name, email } = req.body;
        const existingUser = await User_js_1.default.findOne({ email });
        if (existingUser) {
            throw next(new index_js_1.ValidationError("user already exists with this email"));
        }
        await (0, auth_helper_js_1.checkOtpRestrictions)(email, next);
        await (0, auth_helper_js_1.trackOtpRequests)(email, next);
        await (0, auth_helper_js_1.sendOtp)(name, email, "user-activation-mail");
        res.status(200).json({
            message: "otp sent to email. please verify your account",
        });
    }
    catch (e) {
        console.log(e);
    }
};
exports.userRegistration = userRegistration;
const verifyUser = async (req, res, next) => {
    try {
        const { name, email, password, otp } = req.body;
        if (!name || !email || !password || !otp) {
            return next(new index_js_1.ValidationError("All fields are required"));
        }
        const existingUser = await User_js_1.default.findOne({ email });
        if (existingUser) {
            throw next(new index_js_1.ValidationError("user already exists with this email"));
        }
        await (0, auth_helper_js_1.verifyOtp)(email, otp, next);
        const hashPassword = await bcryptjs_1.default.hash(password, 10);
        await User_js_1.default.create({
            name,
            email,
            password: hashPassword,
        });
        res.status(201).json({
            message: "user registered successfully",
            success: true,
        });
    }
    catch (e) {
        return next(e);
    }
};
exports.verifyUser = verifyUser;
//# sourceMappingURL=auth.controller.js.map