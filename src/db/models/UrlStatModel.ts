import mongoose from "mongoose";

/** I generate the  values, because the app is runing
 * locally and it can't access remote IP addresses.
 * The implementation is commented for true IP addresses.
 * Fake countries 
 */
const randomCountry = () => {
    const countries = ['US', 'SWZ', 'TUR', 'USA', 'GBR', 'NGA'];
    const rand = Math.ceil(Math.random() * 6);
    return countries[rand];
};
/** Fake referrers */
const randomReferrers = () => {
    const referrers = [
        'https:indicina.co',
        'https://google.com',
        'https://linkedin.com', 
        'https://twitter.com', 
        'https://instangram.com', 
        'https://tylara.com'
    ];
    const rand = Math.ceil(Math.random() * 6);
    return referrers[rand];
};

const URLStatSchema = new mongoose.Schema({
        url_id: {type: String, required: true},
        ip_address: {type: String, required: true},
        country: {type: String, required: true, default: randomCountry()},
        referrer: {type: String, required: true, default: randomReferrers()}
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