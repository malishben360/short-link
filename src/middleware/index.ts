import { getUserBySessionToken } from '../db';
import express, { NextFunction } from 'express';
import { merge } from 'lodash';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try{
        /** Check if cookie is set */
        const sessionToken = req.cookies['INDICINA-AUTH'];
        if(!sessionToken){
            return res.status(403).send('Cookie not found');
        }

        /** Check if the user exist */
        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser){
            return res.status(403).send('User not found');
        }

        /** Chain user to request object */
        merge(req, { identity: existingUser });

        return next();
    } catch(error){
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
}