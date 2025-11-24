"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileModel = void 0;
const mongoose_1 = require("mongoose");
const userProfileSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: () => new mongoose_1.Types.ObjectId().toString()
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    avatarUrl: {
        type: String,
        default: null
    },
    preferences: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'user_profiles'
});
userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ created_at: -1 });
exports.UserProfileModel = (0, mongoose_1.model)('UserProfileModel', userProfileSchema);
//# sourceMappingURL=UserProfile.js.map