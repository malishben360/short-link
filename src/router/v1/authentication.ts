import express from 'express';

import { register, login } from '../../controller/AuthenticationController';

/** Authentication end points */
export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
}