import { Document } from 'mongoose';
export interface IUserPreferences {
    theme?: string;
    notifications?: boolean;
    language?: string;
    [key: string]: any;
}
export interface IUserProfile extends Document {
    _id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
    preferences?: IUserPreferences;
    created_at: Date;
    updated_at: Date;
}
export declare const UserProfileModel: import("mongoose").Model<IUserProfile, {}, {}, {}, Document<unknown, {}, IUserProfile, {}, {}> & IUserProfile & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserProfile.d.ts.map