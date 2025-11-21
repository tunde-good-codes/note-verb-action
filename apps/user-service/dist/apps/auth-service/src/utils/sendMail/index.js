"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const renderEmailTemplate = async (templateName, data) => {
    const templatePath = path_1.default.join(process.cwd(), "apps", "auth-service", "src", "utils", "emil-templates", `${templateName}.ejs`);
    return ejs_1.default.renderFile(templatePath, data);
};
const sendEmail = async (to, subject, templateName, data) => {
    try {
        const html = await renderEmailTemplate(templateName, data);
        await transporter.sendMail({
            from: `${process.env.SMTP_USER}`,
            to,
            subject,
            html,
        });
        return true;
    }
    catch (e) {
        console.log("error sending mail: " + e);
        return false;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=index.js.map