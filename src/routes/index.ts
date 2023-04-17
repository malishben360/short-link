import express  from "express";

import authentication from "./v1/authentication.route";
import user from "./v1/user.route";
import url from "./v1/url.route";

const router = express.Router();

export default(): express.Router => {
    authentication(router);
    user(router);
    url(router)
    return router;
}