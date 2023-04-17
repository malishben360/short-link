import { getUserBySessionToken } from '../models';
import express, { NextFunction } from 'express';
import { get, merge } from 'lodash';

export const isOwner = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try{
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        /** Check for id */
        if(!id){
            return res.sendStatus(400);
        }

        /** Check for matched id */
        if (currentUserId.toString() !== id){
            return res.sendStatus(403);
        }

        return next();
    } catch(error){
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try{
        /** Check if cookie is set */
        const COOKIE_NAME = process.env.COOKIE_NAME || 'INDICINA-AUTH'
        const sessionToken = req.cookies[COOKIE_NAME];
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

/** Get the true IP address of a visitor */
export const trueIPAdress = (req: express.Request, res: express.Response, next: NextFunction) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    merge(req, {clientIP: ipAddress})
    return next();
}