import { deleteUserById, getUserById, getUsers } from '../models';
import express from 'express';

export const fectUsers = async (req: express.Request, res: express.Response) => {
    try{
        /** Get all users */
        const users = await getUsers();

        return res.status(200).json(users).end();
    } catch(error){
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{
        /** Check for Id */
        const { id } = req.params
        if(!id){
            return res.sendStatus(400);
        }

        const deletedUser = await deleteUserById(id);
        
        /** User deleted successful */
        if(!deletedUser){
            return res.sendStatus(417);
        }
        
        return res.status(204).json(deletedUser).end();
    } catch(error){
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params
        const { username } = req.body;
        
        /** Check for Id */
        if(!id){
            return res.sendStatus(400);
        }

        const user = await getUserById(id);

        /** Check for user */
        if(!user){
            return res.sendStatus(404);
        }

        user.username = username;
        const updatedUser = await user.save();

        return res.status(200).json(updatedUser).end();
    } catch(error){
        console.log("Error: ", error);
        return res.sendStatus(400);
    }
}