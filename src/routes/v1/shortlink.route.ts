import * as express from 'express';

import { isAuthenticated, trueIPAdress } from '../../middlewares';
import { encodeOriginalURL, decodeShortLink, deleteShortLink } from '../../controllers/shortlink.controller';

export default (router: express.Router) => {
    router.get('/decode', isAuthenticated, trueIPAdress, decodeShortLink);
    router.post('/encode', isAuthenticated, encodeOriginalURL);
    router.delete('/urls/:url_path', isAuthenticated, deleteShortLink);
}