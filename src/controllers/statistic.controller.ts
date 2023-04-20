import * as express from 'express';

import { getShortLinkByShortCode, getStatisticsByShortLinkId } from '../services';
import {
    getVisites,
    getLastVisitedAt,
    getCountryVisitsFromShortLinkPath, 
    getReferrerDomains
} from '../helpers';

export const computeStatistics = async (req: express.Request, res: express.Response) => {
    try{
        const { url_path } = req.params;
        
        /** Check for encoded component */
        if (!url_path) {
            return res.sendStatus(400);
        }

        const shortLink = await getShortLinkByShortCode(url_path);

        /** Check if url path is associated with short link */
        if (!shortLink) {
            return res.status(404).json().end();
        }

        const urlId = shortLink._id.toString();
        const urlStats = await getStatisticsByShortLinkId(urlId);

        const visites = getVisites(urlStats);
        const lastVisitedAt = getLastVisitedAt(urlStats) || '0000-00-00T00:00:00.000+00:00';
        const countries = getCountryVisitsFromShortLinkPath(urlStats);
        const referrers = getReferrerDomains(urlStats);

        return res.status(200).json({
            original_url:shortLink.original_url,
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