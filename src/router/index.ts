import express  from "express";

import authentication from "./v1/authentication";
import user from "./v1/user";

const router = express.Router();

export default(): express.Router => {
    authentication(router);
    user(router);
    return router;
}