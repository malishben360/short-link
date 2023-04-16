import { isAuthenticated } from '../../middleware';
import { createShortURL } from '../../controller/UrlController';
import express from 'express';

export default (router: express.Router) => {
    router.post('/encode', isAuthenticated, createShortURL);
}