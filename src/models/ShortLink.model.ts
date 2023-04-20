import mongoose, {Document} from "mongoose";

export interface Link  extends Document{
    original_url: string;
    shortcode: string;
    user_id: string;
}

const ShortLinkSchema = new mongoose.Schema<Link>(
    {
        original_url: {type: String, required: true},
        shortcode: {type: String, required: true},
        user_id: { type: String, required: true},
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export default mongoose.model('ShortLink', ShortLinkSchema);