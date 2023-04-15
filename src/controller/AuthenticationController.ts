import express from 'express';
import { getUserByEmail, createUser } from 'db';
import { random, authentication } from 'helpers';

export const register = async (req: express.Request, res: express.Response) => {
    try{
        /** Check if the correct json object is send */
        const {username, email, password} = req.body;
        if( !username || !email || !password){
            return res.status(400).send("Username, email and password are required.");
        }

        /** Check if user with the same email exist */
        const existingUser = await getUserByEmail(email);

        /** If user exist send bad request status */
        if(!existingUser){
            return res.status(400).send("Email already taken.");
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
        return res.status(201).send(user).end();
    } catch(error) {
        console.log('Error: ', error);
        return res.send(400);
    }
}