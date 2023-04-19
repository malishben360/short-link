import mongoose from "mongoose";

const StatisticSchema = new mongoose.Schema({
        url_id: {type: String, required: true},
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