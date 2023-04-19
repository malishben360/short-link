import * as express from 'express';
import { get } from 'lodash';
import ip from 'ip';
//import geoip from 'geoip-lite';

import { 
    createURL, 
    createStatistic, 
    getURLByCode, 
    deleteURLById,
    getLongURLByUserIdAndURL,
    deleteStatisticsByURLId, 
} from '../services';
import { 
    generateShortCode,
    extractEncodedComponent,
    generateRandomCountryCode,
    generateRandomReferrer,
    extractDomainFromReferrer,
    isValidURL
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

        /** It keeps track of previously generated codes to avoid collisions */
        const existingLongURL = await getLongURLByUserIdAndURL(userId, longURL);
        if (existingLongURL) {
            return res.status(200).json({ 
                shortURL: `http://short.est/${ existingLongURL.encoded }` 
            });
        }

        /** Create new short URL */
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
        await createStatistic({
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

export const deleteShortURL = async (req: express.Request, res: express.Response) => {
    try{
        const { url_path } = req.params;

        /** Check if url_path is available */
        if (!url_path) {
            return res.sendStatus(400);
        }

        const shortURL = await getURLByCode(url_path);

        /** Check if short URL is available */
        if (!shortURL) {
            return res.sendStatus(404);
        }

        const deletedURL = await deleteURLById(shortURL._id.toString());

        if (!deletedURL) {
            return res.sendStatus(500);
        }

        /** Clear  deleted short URL history */
        await deleteStatisticsByURLId(deletedURL._id.toString());

        return res.sendStatus(204);
    } catch(error: any) {
        console.log('Error: ', error);
        res.sendStatus(400);
    }
}