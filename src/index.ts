import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

/** Authentication purpose */
app.use(cors({
    credentials: true,
}));

/** Enables Cookies and JSON data transfer */
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.set('trust proxy', true);

const server = http.createServer(app);

const port = process.env.PORT || 9000;

/**Server listening at port 9000 by default if port environment variable is null */
server.listen(port, ()=> {
    console.log("Server listening at port: ", port); 
})

/** Mongo Database connection url
 * If you are connection to a live cluster
 * change the url to the live cluster url.
 */
const MONGO_URL = 'mongodb://127.0.0.1:27017/UrlShrinkDB';

/** Sync mongoose Promise with node's Promise
 * and connect to the local mongoDB.
 */
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('open', ()=> console.log('Database Connected...'));
mongoose.connection.on('error', (error: Error) => console.log(error));

/** Routes entry point */
app.use('/api/v1/', router());