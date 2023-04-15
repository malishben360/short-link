import express  from "express";

import authentication from "./v1/authentication";
const router = express.Router();

export default(): express.Router => {
    authentication(router);
    
    return router;
}