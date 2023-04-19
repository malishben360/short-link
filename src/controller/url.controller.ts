import express from 'express';
import { get } from 'lodash';
import ip from 'ip';
//import geoip from 'geoip-lite';
import { 
    createURL, 
    createURLStat, 
    getURLByCode, 
    getLongURLByUserAndURL, 
    getURLStatisticByURLId 
} from '../models';
import { 
    generateShortCode,
    extractEncodedComponent,
    getVisites,
    getCountryVisitsFromUrlPath,
    getReferrerDomains,
    generateRandomCountryCode,
    generateRandomReferrer,
    extractDomainFromReferrer,
    isValidURL,
    getLastVisitedAt
} from '../helpers';

export const encodeLongURL = async (req: express.Request, res: express.Response) => {
    try{
        const { longURL } = req.body;
        
        /** Check for long URL */
        if (!longURL || !isValidURL(longURL)) {
            return res.sendStatus(400);
        }
        
        let userId = get(req, 'identity._id') as string;
        userId = userId.toString();

        /** Get short URL code */
        const encoded = generateShortCode(longURL, userId);

        /** It keeps track of previously generated codes to avoid collisions
         *  with existing ones in the database. 
         */
        const existingLongURL = await getLongURLByUserAndURL(userId, longURL);
        if (existingLongURL) {
            return res.status(200).json({ 
                shortURL: `http://short.est/${ existingLongURL.encoded }` 
            });
        }

        const shortURL = await createURL({
            long_url: longURL,
            encoded: encoded,
            user_id: userId
        });

        /** URL is not created */
        if (!shortURL){
            return res.sendStatus(422);
        }

        return res.status(201).json({
            shortURL: `http://short.est/${ encoded }`
        }).end();
    } catch (error) {
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
    
}

export const decodeShortURL = async (req: express.Request, res: express.Response) => {
    try {
        const { shortURL } = req.body;

        /** Check for short URL */
        const DOMAIN_NAME = process.env.DOMAIN_NAME || 'http://short.est/';
        if (!shortURL || !(shortURL.startsWith(DOMAIN_NAME))) {
            return res.sendStatus(400);
        }


        /** On live server true remote IP Address and country can be grap
         * by these commented line of codes 77 - 83
         */
        //const clientIP = get(req, 'clientIP');
        // const geo = geoip.lookup(clientIP);
        // const country = geo.country;

        //const referrer = req.get("Referrer"); // Get the referrer header from the request object
        //const domain = extractDomainFromReferrer(referrer);

        const localClientIP = ip.address(); //this is for a local server



        /** Get extract encoded component from short URL*/
        const encoded = extractEncodedComponent(shortURL);

        /** Check if URL exist */
        const url = await getURLByCode(encoded);
        if (!url) {
            return res.sendStatus(404);
        }

        /** On live server 
         * change randomCountry() to country.
         * change randomReferrers() to domain.
         * change localClientIp to clientIP.
         */
        await createURLStat({
            url_id: url._id.toString(),
            ip_address: localClientIP,
            country: generateRandomCountryCode(),
            referrer: generateRandomReferrer()
        });

        return res.status(200).json({ longURL: url.long_url }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const computeURLStatistics = async (req: express.Request, res: express.Response) => {
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
        const urlStats = await getURLStatisticByURLId(urlId);

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