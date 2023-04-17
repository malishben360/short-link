import mongoose from "mongoose";

const URLSchema = new mongoose.Schema(
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

export const URLModel = mongoose.model('Url', URLSchema);

/**URL model actions */
export const getURLs = () => URLModel.find();
export const getURLsByUserId = (user_id: string) => URLModel.find({ user_id });
export const getURLById = (id: string) => URLModel.findById(id);
export const getURLByEncoded = (encoded: string) => URLModel.findOne({ encoded });
export const getURLByURL = (userId: string, longURL: string) => URLModel.findOne({ long_url: longURL, user_id: userId });
export const deletURLById = (id: string) => URLModel.findOneAndDelete({ _id: id });
export const createURL = (values: Record<string, any>) => new URLModel(values)
    .save().then((url) => url.toObject());
export const updateURLById = (id: string, values: Record<string, any>) => URLModel.findByIdAndUpdate(id, values);