import * as express from 'express';

import { isAuthenticated, trueIPAdress } from '../../middlewares';
import { encodeLongURL, decodeShortURL, deleteShortURL } from '../../controllers/url.controller';

export default (router: express.Router) => {
    router.get('/decode', isAuthenticated, trueIPAdress, decodeShortURL);
    router.post('/encode', isAuthenticated, encodeLongURL);
    router.delete('/urls/:url_path', isAuthenticated, deleteShortURL);
}