import { deleteUser, fectUsers } from '../../controller/user.controller';
import express from 'express';
import { isAuthenticated, isOwner } from '../../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, fectUsers);
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
}