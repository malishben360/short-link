import * as express from 'express';

import { getUserByEmail, createUser } from '../services';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try{
        const COOKIE_NAME = process.env.COOKIE_NAME || 'INDICINA-AUTH';
        /** check if the correct json object is send */
        const { email, password } = req.body;
        if (!email || !password){
            return res.sendStatus(400);
        }

        /** Check if user with this email exist */
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.sendStatus(401);
        }

        /**Authenticate user*/
        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== expectedHash){
            return res.sendStatus(401);
        }

        /** Set user session and cookie */
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        res.cookie(COOKIE_NAME, user.authentication.sessionToken, { domain: 'localhost', path: '/'});

        return res.status(200).json(user).end();
    } catch(error){
        console.log("Error: ", error);
        res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try{
        /** Check if the correct json object is send */
        const {username, email, password} = req.body;
        if( !username || !email || !password){
            return res.sendStatus(400);
        }

        /** Check if user with the same email exist */
        const existingUser = await getUserByEmail(email);

        /** If user exist send bad request status */
        if(existingUser){
            return res.status(409).send('User already exists');
        }

        /** All requirements passed */
        const salt = random();
        const user = await createUser({
            username,
            email,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        /** Send back the newly created user */
        return res.status(201).json(user).end();
    } catch(error) {
        console.log('Error: ', error);
        return res.sendStatus(400);
    }
}