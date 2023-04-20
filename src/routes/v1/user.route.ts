import * as express from 'express';

import { deleteUser, fectUsers, updateUser } from '../../controllers/user.controller';
import { isAuthenticated, isOwner } from '../../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, fectUsers);
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser)
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
}