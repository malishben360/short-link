import * as express from 'express';

import { computeStatistics } from '../../controllers/statistic.controller';

export default (router: express.Router) => {
    router.get('/statistic/:url_path', computeStatistics);
}