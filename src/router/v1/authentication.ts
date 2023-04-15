import express from 'express';

import { register } from '../../controller/AuthenticationController';

/** Authentication end points */
export default (router: express.Router) => {
    router.post('/auth/register', register);
}