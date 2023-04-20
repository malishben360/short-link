import * as express from 'express';
import { get } from 'lodash';
import ip from 'ip';
//import geoip from 'geoip-lite';

import { 
    createShortLink, 
    createStatistic, 
    getShortLinkByShortCode, 
    deleteShortLinkById,
    getShortLinkByUserIdAndURL,
    deleteStatisticsByShortLinkId, 
} from '../services';
import { 
    generateShortCode,
    extractEncodedComponent,
    generateRandomCountryCode,
    generateRandomReferrer,
    extractDomainFromReferrer,
    isValidURL
} from '../helpers';

export const encodeOriginalURL = async (req: express.Request, res: express.Response) => {
    try{
        const { originalURL } = req.body;
        
        /** Check for original URL */
        if (!originalURL || !isValidURL(originalURL)) {
            return res.sendStatus(400);
        }
        
        let userId = get(req, 'identity._id') as string;
        userId = userId.toString();

        /** Get short link code */
        const shortCode = generateShortCode(originalURL, userId);

        /** It keeps track of previously generated codes to avoid collisions */
        const existingShortLink = await getShortLinkByUserIdAndURL(userId, originalURL);
        if (existingShortLink) {
            return res.status(200).json({ 
                shortLink: `http://short.est/${ existingShortLink.shortcode }` 
            });
        }

        /** Create new short link */
        const shortLink = await createShortLink({
            original_url: originalURL,
            shortcode: shortCode,
            user_id: userId
        });

        /** Short link is not created */
        if (!shortLink){
            return res.sendStatus(422);
        }

        return res.status(201).json({
            shortLink: `http://short.est/${ shortCode }`
        }).end();
    } catch (error) {
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
    
}

export const decodeShortLink = async (req: express.Request, res: express.Response) => {
    try {
        const DOMAIN_NAME = process.env.DOMAIN_NAME || 'http://short.est/';
        const { shortLink } = req.body;

        /** Check for short link */
        if (!shortLink || !(shortLink.startsWith(DOMAIN_NAME))) {
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



        /** Get extract encoded component from short link*/
        const encodedComponent = extractEncodedComponent(shortLink);

        const existingShortLink = await getShortLinkByShortCode(encodedComponent);

        /** Check if short link exist */
        if (!existingShortLink) {
            return res.sendStatus(404);
        }

        /** On live server 
         * change randomCountry() to country.
         * change randomReferrers() to domain.
         * change localClientIp to clientIP.
         */
        await createStatistic({
            shortlink_id: existingShortLink._id.toString(),
            ip_address: localClientIP,
            country: generateRandomCountryCode(),
            referrer: generateRandomReferrer()
        });

        return res.status(200).json({ originalURL: existingShortLink.original_url }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteShortLink = async (req: express.Request, res: express.Response) => {
    try{
        const { url_path } = req.params;

        /** Check if url_path is available */
        if (!url_path) {
            return res.sendStatus(400);
        }

        const shortLink = await getShortLinkByShortCode(url_path);

        /** Check if url path is associated with short link */
        if (!shortLink) {
            return res.sendStatus(404);
        }

        const deletedShortLink = await deleteShortLinkById(shortLink._id.toString());

        if (!deletedShortLink) {
            return res.sendStatus(500);
        }

        /** Clear  deleted short link history */
        await deleteStatisticsByShortLinkId(deletedShortLink._id.toString());

        return res.sendStatus(204);
    } catch(error: any) {
        console.log('Error: ', error);
        res.sendStatus(400);
    }
}