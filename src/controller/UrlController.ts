import { createUrl, getUrlByEncoded, getUrlByLongUrl } from '../db';
import express from 'express';
import { encodeURI } from '../helpers';
import { get } from 'lodash';

export const createShortURL = async (req: express.Request, res: express.Response) => {
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
        const existingLongURL = await getUrlByLongUrl(userId, longURL);
        if (existingLongURL) {
            return res.status(200).json({
                shortURL: `http://short.est/${ existingLongURL.encoded }`
            })
        }

        const shortURL = await createUrl({
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