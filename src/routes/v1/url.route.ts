import * as express from 'express';

import { isAuthenticated, trueIPAdress } from '../../middlewares';
import { encodeLongURL, decodeShortURL } from '../../controller/url.controller';

export default (router: express.Router) => {
    router.post('/encode', isAuthenticated, encodeLongURL);
    router.get('/decode', isAuthenticated, trueIPAdress, decodeShortURL);
}