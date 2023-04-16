import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
    {
        long_url: {type: String, required: true},
        encoded: {type: String, required: true},
        user_id: { type: String, required: true},
    },
    {
        timestamps: {
            createdAt: 'created-at',
            updatedAt: 'updated-at'
        }
    }
);

export const UrlModel = mongoose.model('Url', UrlSchema);

/**Url model actions */
export const getUrls = () => UrlModel.find();
export const getUrlsByUserId = (userId: string) => UrlModel.find({ user_id: userId });
export const getUrlById = (id: string) => UrlModel.findById(id);
export const getUrlByEncoded = (encoded: string) => UrlModel.findOne({ encoded });
export const deletUrlById = (id: string) => UrlModel.findOneAndDelete({ _id: id });
export const createUrl = (values: Record<string, any>) => new UrlModel(values)
    .save().then((user) => user.toObject());
export const updateUrlById = (id: string, values: Record<string, any>) => UrlModel.findByIdAndUpdate(id, values);