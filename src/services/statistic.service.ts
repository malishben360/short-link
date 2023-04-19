import StatisticModel from "../models/statistic.model";

export const getStatistics = () => StatisticModel.find();
export const getStatisticsByURLId = (urlId: string) => StatisticModel.find({ url_id: urlId });
export const deleteStatisticById = (statisticId: string) => StatisticModel.findOneAndDelete({ _id: statisticId });
export const deleteStatisticsByURLId = (urlId: string) => StatisticModel.deleteMany({ url_id: urlId })
export const createStatistic = (values: Record<string, any>) => new StatisticModel(values).save()
    .then((statistic) => statistic.toObject());
export const clearStatistics = () => StatisticModel.deleteMany();