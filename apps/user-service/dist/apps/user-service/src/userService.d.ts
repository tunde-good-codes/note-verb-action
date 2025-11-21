import { UpdateProfileRequest, UserProfile } from "../../../shared/types";
export declare class UserService {
    private authClient;
    constructor();
    createProfile(userId: string, profileData: Partial<UpdateProfileRequest>): Promise<UserProfile>;
    getProfile(userId: string): Promise<UserProfile | null>;
    updateProfile(userId: string, profileData: Partial<UpdateProfileRequest>): Promise<UserProfile>;
    deleteProfile(userId: string): Promise<void>;
    private sanitizeProfileData;
    private mapToUserProfile;
}
//# sourceMappingURL=userService.d.ts.map