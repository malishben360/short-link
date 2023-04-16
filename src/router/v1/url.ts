import { isAuthenticated } from '../../middleware';
import { encodeLongURL } from '../../controller/UrlController';
import express from 'express';

export default (router: express.Router) => {
    router.post('/encode', isAuthenticated, encodeLongURL);
}