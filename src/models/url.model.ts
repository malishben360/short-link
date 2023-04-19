import mongoose from "mongoose";

const URLSchema = new mongoose.Schema(
    {
        long_url: {type: String, required: true},
        encoded: {type: String, required: true},
        user_id: { type: String, required: true},
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export default mongoose.model('Url', URLSchema);