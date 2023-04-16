import mongoose from "mongoose";

const URLStatSchema = new mongoose.Schema({
        url_id: {type: String, required: true},
        ip_address: {type: String, required: true},
        country: {type: String, required: true, default: 'US'},
        referrer: {type: String, required: true, default: 'indicina'}
    },
    {
        timestamps: {
            createdAt: 'created-at',
            updatedAt: 'updated-at'
        }
    }
);

const URLStatModel = mongoose.model('Url_stat', URLStatSchema);

/** URL Stat actions */
export const getURLStats = () => URLStatModel.find();
export const getURLStatsByURLId = (url_id: string) => URLStatModel.find({ url_id });
export const createURLStat = (values: Record<string, any>) => new URLStatModel(values).save()
    .then((urlStat) => urlStat.toObject());
export const clearURLStats = () => URLStatModel.deleteMany();