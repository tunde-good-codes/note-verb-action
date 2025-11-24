"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const authClient_1 = require("./authClient");
const UserProfile_1 = require("./models/UserProfile");
const utils_1 = require("../../../shared/utils");
class UserService {
    constructor() {
        this.authClient = new authClient_1.AuthClient();
    }
    async createProfile(userId, profileData) {
        const existingProfile = await UserProfile_1.UserProfileModel.findOne({ userId });
        if (existingProfile) {
            throw (0, utils_1.createServiceError)("User profile already exists", 409);
        }
        const sanitizedData = this.sanitizeProfileData(profileData);
        const profile = await UserProfile_1.UserProfileModel.create({
            userId,
            ...sanitizedData,
        });
        return this.mapToUserProfile(profile);
    }
    async getProfile(userId) {
        const profile = await UserProfile_1.UserProfileModel.findOne({ userId });
        if (!profile) {
            throw (0, utils_1.createServiceError)("User profile not found", 404);
        }
        return this.mapToUserProfile(profile);
    }
    async updateProfile(userId, profileData) {
        const existingProfile = await UserProfile_1.UserProfileModel.findOne({ userId });
        if (!existingProfile) {
            return this.createProfile(userId, profileData);
        }
        const sanitizedData = this.sanitizeProfileData(profileData);
        const updatedProfile = await UserProfile_1.UserProfileModel.findOneAndUpdate({ userId }, sanitizedData, { new: true, runValidators: true });
        if (!updatedProfile) {
            throw (0, utils_1.createServiceError)("Failed to update profile", 500);
        }
        return this.mapToUserProfile(updatedProfile);
    }
    async deleteProfile(userId) {
        const result = await UserProfile_1.UserProfileModel.deleteOne({ userId });
        if (result.deletedCount === 0) {
            throw (0, utils_1.createServiceError)("User profile not found", 404);
        }
    }
    sanitizeProfileData(data) {
        const sanitized = {};
        if (data.firstName !== undefined) {
            sanitized.firstName = data.firstName
                ? (0, utils_1.sanitizeInput)(data.firstName)
                : null;
        }
        if (data.lastName !== undefined) {
            sanitized.lastName = data.lastName ? (0, utils_1.sanitizeInput)(data.lastName) : null;
        }
        if (data.bio !== undefined) {
            sanitized.bio = data.bio ? (0, utils_1.sanitizeInput)(data.bio) : null;
        }
        if (data.avatarUrl !== undefined) {
            sanitized.avatarUrl = data.avatarUrl
                ? (0, utils_1.sanitizeInput)(data.avatarUrl)
                : null;
        }
        if (data.preferences !== undefined) {
            sanitized.preferences = data.preferences ? data.preferences : null;
        }
        return sanitized;
    }
    mapToUserProfile(mongoProfile) {
        return {
            id: mongoProfile._id,
            userId: mongoProfile.userId,
            firstName: mongoProfile.firstName,
            lastName: mongoProfile.lastName,
            bio: mongoProfile.bio,
            avatarUrl: mongoProfile.avatarUrl,
            preferences: mongoProfile.preferences || {},
            createdAt: mongoProfile.created_at,
            updatedAt: mongoProfile.updated_at,
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map