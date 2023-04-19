import * as express from 'express';

import { getURLByCode, getStatisticsByURLId } from '../services';
import {
    getVisites,
    getLastVisitedAt,
    getCountryVisitsFromUrlPath, 
    getReferrerDomains
} from '../helpers';

export const computeStatistics = async (req: express.Request, res: express.Response) => {
    try{
        const { url_path } = req.params;
        
        /** Check for encoded component */
        if (!url_path) {
            return res.sendStatus(400);
        }

        const url = await getURLByCode(url_path);

        /** Check for URL */
        if (!url) {
            return res.status(404).json().end();
        }

        const urlId = url._id.toString();
        const urlStats = await getStatisticsByURLId(urlId);

        const visites = getVisites(urlStats);
        const lastVisitedAt = getLastVisitedAt(urlStats) || '0000-00-00T00:00:00.000+00:00';
        const countries = getCountryVisitsFromUrlPath(urlStats);
        const referrers = getReferrerDomains(urlStats);

        return res.status(200).json({
            longURL: url.long_url,
            visites,
            countries,
            referrers,
            lastVisitedAt
        }).end();
    } catch (error) {
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
}