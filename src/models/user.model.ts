import mongoose from "mongoose";

/** Fields with select false are not return by default
 * Always specify during data fetch.
 */
const UserSchema = new mongoose.Schema({
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