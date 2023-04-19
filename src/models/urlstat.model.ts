import mongoose from "mongoose";

const URLStatSchema = new mongoose.Schema({
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

const URLStatModel = mongoose.model('Url_stat', URLStatSchema);

/** URL Stat actions */
export const getURLStats = () => URLStatModel.find();
export const getURLStatisticByURLId = (urlId: string) => URLStatModel.find({ url_id: urlId });
export const createURLStat = (values: Record<string, any>) => new URLStatModel(values).save()
    .then((urlStat) => urlStat.toObject());
export const clearURLStats = () => URLStatModel.deleteMany();