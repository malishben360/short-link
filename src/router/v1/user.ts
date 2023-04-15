import { deleteUser, fectUsers } from '../../controller/UserController';
import express from 'express';
import { isAuthenticated } from '../../middleware';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, fectUsers);
    router.delete('/users/:id', isAuthenticated, deleteUser);
}