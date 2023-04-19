import * as express  from "express";

import authenticationRoute from "./v1/authentication.route";
import userRoute from "./v1/user.route";
import urlRoute from "./v1/url.route";
import statisticRoute from "./v1/statistic.route";

const router = express.Router();

export default(): express.Router => {
    authenticationRoute(router);
    userRoute(router);
    urlRoute(router);
    statisticRoute(router);
    return router;
}