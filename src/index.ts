import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

const app = express();

/** Authentication purpose */
app.use(cors({
    credentials: true,
}));

/** Enables Cookies and JSON data transfer */
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT? process.env.PORT : 9000;

/**Server listening at port 9000 by default if port environment variable is null */
server.listen(port, ()=> {
    console.log("Server listening at port: ", port); 
})