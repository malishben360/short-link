import express  from "express";

import authentication from "./v1/authentication";
import user from "./v1/user";
import url from "./v1/url";

const router = express.Router();

export default(): express.Router => {
    authentication(router);
    user(router);
    url(router)
    return router;
}