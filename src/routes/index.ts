import * as express  from "express";

import authenticationRoute from "./v1/authentication.route";
import userRoute from "./v1/user.route";
import shortLinkRoute from "./v1/shortlink.route";
import statisticRoute from "./v1/statistic.route";

const router = express.Router();

export default(): express.Router => {
    authenticationRoute(router);
    userRoute(router);
    shortLinkRoute(router);
    statisticRoute(router);
    return router;
}