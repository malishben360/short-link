import express from 'express';
import { get } from 'lodash';
import ip from 'ip';
import { 
    createURL, 
    createURLStat, 
    getURLByEncoded, 
    getURLByURL, 
    getURLStatsByURLId 
} from '../db';
import { 
    encodeURL,
    extractEncoded,
    DOMAIN,
    getClicks,
    getCountries,
    getReferrers
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
        const encoded = encodeURL(longURL);

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

        //const clientIP = get(req, 'clientIP'); //this is for a remote servers
        const clientIP = ip.address(); //this is for a local server


        /** Check for short URL */
        if (!shortURL || !(shortURL.startsWith(DOMAIN))) {
            return res.status(400).send('URL sanitization');
        }

        /** Get extract encoded from short URL*/
        const encoded = extractEncoded(shortURL);

        /** Check if URL exist */
        const url = await getURLByEncoded(encoded);
        if (!url) {
            return res.sendStatus(404);
        }

        const urlStat = await createURLStat({
            url_id: url.user_id.toString(),
            ip_address: clientIP,
        });

        return res.status(200).json({ longURL: url.long_url }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getURLStats = async (req: express.Request, res: express.Response) => {
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