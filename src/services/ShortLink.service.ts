import ShortLinkModel from "../models/ShortLink.model";

/**Short link model services */
export const getShortLinks = () => ShortLinkModel.find();
export const getShortLinksByUserId = (user_id: string) => ShortLinkModel.find({ user_id });
export const getShortLinkById = (id: string) => ShortLinkModel.findById(id);
export const getShortLinkByShortCode = (shortCode: string) => ShortLinkModel.findOne({ shortcode: shortCode });
export const getShortLinkByUserIdAndURL = (userId: string, originalURL: string) => ShortLinkModel.findOne({ original_url: originalURL, user_id: userId });
export const deleteShortLinkById = (id: string) => ShortLinkModel.findOneAndDelete({ _id: id });
export const createShortLink = (values: Record<string, any>) => new ShortLinkModel(values)
    .save().then((shortlink: any) => shortlink.toObject());
export const updateShortLinkById = (id: string, values: Record<string, any>) => ShortLinkModel.findByIdAndUpdate(id, values);