import StatisticModel from "../models/statistic.model";

export const getStatistics = () => StatisticModel.find();
export const getStatisticsByShortLinkId = (shortLinkId: string) => StatisticModel.find({ shortlink_id: shortLinkId });
export const deleteStatisticById = (statisticId: string) => StatisticModel.findOneAndDelete({ _id: statisticId });
export const deleteStatisticsByShortLinkId = (shortLinkId: string) => StatisticModel.deleteMany({ shortlink_id: shortLinkId })
export const createStatistic = (values: Record<string, any>) => new StatisticModel(values).save()
    .then((statistic) => statistic.toObject());
export const clearStatistics = () => StatisticModel.deleteMany();