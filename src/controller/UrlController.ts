import { createURL, getURLByEncoded, getURLByURL } from '../db';
import express from 'express';
import { encodeURI, extractEncoded, DOMAIN } from '../helpers';
import { get } from 'lodash';

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
        const encoded = encodeURI(longURL);

        /** Ensure no duplicate long URL for same user.
         * Return the if exist.
         */
        const existingLongURL = await getURLByURL(userId, longURL);
        if (existingLongURL) {
            return res.status(200).json({
                shortURL: `http://short.est/${ existingLongURL.encoded }`
            })
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

        return res.status(200).json({
            longURL: url.long_url
        }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}