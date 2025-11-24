"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDb = async () => {
    try {
        mongoose_1.default.connect(process.env.MONGO_URI, {
            dbName: "ADMIN-DASHBOARD",
        });
        console.log("Connected to mongodb");
    }
    catch (error) {
        console.log(error, "error connecting to db");
    }
};
exports.default = connectDb;
//# sourceMappingURL=db.js.map