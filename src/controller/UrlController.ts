import { createUrl, getUrlByEncoded } from 'db';
import express from 'express';
import { encodeURI } from 'helpers';
import { get } from 'lodash';

export const createShortURL = async (req: express.Request, res: express.Response) => {
    try{
        const { longURL } = req.body;
        const userId = get(req, 'indentity._id') as string;

        /** Check for long URL */
        if (!longURL) {
            return res.sendStatus(400);
        }

        let encoded = encodeURI(longURL);
        let existingURL = getUrlByEncoded(encoded);

        /** Ensure no dupplicate shortURL */
        while (existingURL) {
            encoded = encodeURI(longURL);
            existingURL = getUrlByEncoded(encoded);
        }

        const shortURL = await createUrl({
            long_url: longURL,
            encoded: encoded,
            user_id: userId.toString()
        });

        /** URL is no created */
        if (!shortURL){
            return res.sendStatus(500);
        }

        return res.status(200).json({
            ...shortURL,
            short_url: `http://localhost:9000/api/v1/${encoded}`
        }).end();
    } catch (error) {
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
    
}