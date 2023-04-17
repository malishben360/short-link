import { isAuthenticated, trueIPAdress } from '../../middlewares';
import { encodeLongURL, decodeShortURL, computeURLStats } from '../../controller/url.controller';
import express from 'express';

export default (router: express.Router) => {
    router.post('/encode', isAuthenticated, encodeLongURL);
    router.post('/decode', isAuthenticated, trueIPAdress, decodeShortURL);
    router.get('/statistic/:url_path', isAuthenticated, computeURLStats);
}