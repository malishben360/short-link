import * as express from 'express';

import { deleteUser, fectUsers } from '../../controllers/user.controller';
import { isAuthenticated, isOwner } from '../../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, fectUsers);
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
}