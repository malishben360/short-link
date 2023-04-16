import { isAuthenticated } from '../../middleware';
import { encodeLongURL, decodeShortURL } from '../../controller/UrlController';
import express from 'express';

export default (router: express.Router) => {
    router.post('/encode', isAuthenticated, encodeLongURL);
    router.post('/decode', isAuthenticated, decodeShortURL);
}