import * as express from 'express';

import { computeStatistics } from '../../controller/statistic.controller';

export default (router: express.Router) => {
    router.get('/statistic/:url_path', computeStatistics);
}