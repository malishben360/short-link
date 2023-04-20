import mongoose, { Document } from "mongoose";

export interface User extends Document {
    username: string,
    email: string,
    authentication: { password: string, salt: string, sessionToken: string }
}

const UserSchema = new mongoose.Schema<User>({
        username: { type: String, required: true },
        email: { type: String, required: true },
        authentication: {
            password: { type: String, required: true, select: false },
            salt: { type: String, select: false },
            sessionToken: { type: String, select: false }
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export default mongoose.model('User', UserSchema);