import express from 'express';
import { get } from 'lodash';
import ip from 'ip';
//import geoip from 'geoip-lite';
import { 
    createURL, 
    createURLStat, 
    getURLByEncoded, 
    getURLByURL, 
    getURLStatsByURLId 
} from '../models';
import { 
    encodeURL,
    extractEncoded,
    getClicks,
    getCountries,
    getReferrers,
    randomCountry,
    randomReferrers,
    extractDomainFromReferrer
} from '../helpers';

export const encodeLongURL = async (req: express.Request, res: express.Response) => {
    try{
        const { longURL } = req.body;
        let userId = get(req, 'identity._id') as string;
        
        /** Convert userId to string literals */
        userId = userId.toString();

        /** Check for long URL */
        if (!longURL) {
            return res.status(400).send('Long URL is missing');
        }

        /** Get short URL code */
        const encoded = encodeURL(longURL, userId);

        /** Ensure no duplicate long URL for same user.
         * Return the if exist.
         */
        const existingLongURL = await getURLByURL(userId, longURL);
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

        /** URL is no created */
        if (!shortURL){
            return res.sendStatus(500);
        }

        return res.status(201).json({
            shortURL: `http://short.est/${ encoded }`
        }).end();
    } catch (error) {
        console.log("Error: ", error);
        return res.status(400).send('Database operation failed');
    }
    
}

export const decodeShortURL = async (req: express.Request, res: express.Response) => {
    try {
        const { shortURL } = req.body;
        const DOMAIN_NAME = process.env.DOMAIN_NAME || 'http://short.est/';

        /** On live server true remote IP Address and country can be grap
         * by these commented line of codes 77 - 83
         */
        //const clientIP = get(req, 'clientIP');
        // const geo = geoip.lookup(clientIP);
        // const country = geo.country;

        //const referrer = req.get("Referrer"); // Get the referrer header from the request object
        //const domain = extractDomainFromReferrer(referrer);

        const localClientIP = ip.address(); //this is for a local server


        /** Check for short URL */
        if (!shortURL || !(shortURL.startsWith(DOMAIN_NAME))) {
            return res.status(400).send('URL sanitization');
        }

        /** Get extract encoded from short URL*/
        const encoded = extractEncoded(shortURL);

        /** Check if URL exist */
        const url = await getURLByEncoded(encoded);
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
            country: randomCountry(),
            referrer: randomReferrers()
        });

        return res.status(200).json({ longURL: url.long_url }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const computeURLStats = async (req: express.Request, res: express.Response) => {
    try{
        const { url_path } = req.params;
        
        /** Check for encoded */
        if (!url_path) {
            return res.sendStatus(400);
        }

        const url = await getURLByEncoded(url_path);
        if (!url) {
            return res.sendStatus(404);
        }

        const urlId = url._id.toString();
        const urlStats = await getURLStatsByURLId(urlId);

        const clicks = getClicks(urlStats);
        const countries = getCountries(urlStats);
        const referrers = getReferrers(urlStats);

        return res.status(200).json({
            clicks,
            countries,
            referrers
        }).end();
    } catch (error) {
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
}