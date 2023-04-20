import mongoose, { Document } from "mongoose";

export interface Statistic extends Document {
    shortlink_id: string,
    ip_address: string,
    country: string,
    referrer: string
}

const StatisticSchema = new mongoose.Schema<Statistic>({
        shortlink_id: {type: String, required: true},
        ip_address: {type: String, required: true},
        country: {type: String, required: true, default: 'US'},
        referrer: {type: String, required: true, default: 'https://indicina.co'}
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export default mongoose.model('Url_statistic', StatisticSchema);