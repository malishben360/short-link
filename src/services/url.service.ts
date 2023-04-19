import URLModel from "../models/url.model";

/**URL model actions */
export const getURLs = () => URLModel.find();
export const getURLsByUserId = (user_id: string) => URLModel.find({ user_id });
export const getURLById = (id: string) => URLModel.findById(id);
export const getURLByCode = (encoded: string) => URLModel.findOne({ encoded });
export const getLongURLByUserIdAndURL = (userId: string, longURL: string) => URLModel.findOne({ long_url: longURL, user_id: userId });
export const deletURLById = (id: string) => URLModel.findOneAndDelete({ _id: id });
export const createURL = (values: Record<string, any>) => new URLModel(values)
    .save().then((url) => url.toObject());
export const updateURLById = (id: string, values: Record<string, any>) => URLModel.findByIdAndUpdate(id, values);