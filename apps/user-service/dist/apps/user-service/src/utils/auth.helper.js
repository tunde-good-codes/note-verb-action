"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.trackOtpRequests = exports.sendOtp = exports.checkOtpRestrictions = exports.validateRegistrationData = void 0;
const crypto_1 = __importDefault(require("crypto"));
const index_js_1 = require("@shared/error-handler/index.js");
const index_js_2 = require("./sendMail/index.js");
const index_js_3 = __importDefault(require("@shared/redis/index.js"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateRegistrationData = (data, userType) => {
    const { name, email, password, phone_number, country } = data;
    if (!name ||
        !email ||
        !password ||
        (userType === "seller" && (!phone_number || !country))) {
        throw new index_js_1.ValidationError("Missing Require Fields");
    }
    if (!emailRegex.test(email)) {
        throw new index_js_1.ValidationError("Invalid Email Format");
    }
};
exports.validateRegistrationData = validateRegistrationData;
const checkOtpRestrictions = async (email, next) => {
    if (await index_js_3.default.get(`otp_lock:${email}`)) {
        return next(new index_js_1.ValidationError("Account locked due to multiple failed attempts. try again after 30 minutes"));
    }
    if (await index_js_3.default.get(`otp_spam_lock:${email}`)) {
        return next(new index_js_1.ValidationError("too many otp requests. please wait for an hour and try again"));
    }
    if (await index_js_3.default.get(`otp_cooldown:${email}`)) {
        return next(new index_js_1.ValidationError("Please wait one minute before requesting a new email"));
    }
};
exports.checkOtpRestrictions = checkOtpRestrictions;
const sendOtp = async (email, name, template) => {
    const otp = crypto_1.default.randomInt(1000, 9999).toString();
    await (0, index_js_2.sendEmail)(email, "Verify your email", template, { name, otp });
    index_js_3.default.set(`otp:${email}`, otp, "EX", 300);
    index_js_3.default.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
exports.sendOtp = sendOtp;
const trackOtpRequests = async (email, next) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await index_js_3.default.get(otpRequestKey)) || "0");
    if (otpRequests >= 2) {
        await index_js_3.default.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
        return next(new index_js_1.ValidationError("Too many otp requests. please wait 1 hour before requesting a new otp "));
    }
    await index_js_3.default.set(otpRequestKey, otpRequests + 1, "EX", 3600);
};
exports.trackOtpRequests = trackOtpRequests;
const verifyOtp = async (email, otp, next) => {
    const storedOtp = await index_js_3.default.get(`otp:${email}`);
    if (!storedOtp) {
        throw new index_js_1.NotFoundError("otp not found or expired!");
    }
    const failedAttemptKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await index_js_3.default.get(failedAttemptKey)) || "0");
    if (storedOtp !== otp) {
        if (failedAttempts >= 2) {
            await index_js_3.default.set(`otp_lock:${email}`, "locked", "EX", 1800);
            await index_js_3.default.del(`otp:${email}`, failedAttemptKey);
            throw new index_js_1.ValidationError("Too many failed attempts, your account is locked for 30 minutes");
        }
        await index_js_3.default.set(failedAttemptKey, failedAttempts + 1, "EX", 300);
        throw new index_js_1.ValidationError(`incorrect OTP. ${2 - failedAttempts} attempts left`);
    }
    await index_js_3.default.del(`otp:${email}`, failedAttemptKey);
};
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=auth.helper.js.map