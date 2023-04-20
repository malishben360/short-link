import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes';

/** Expose environment viriables */
dotenv.config();

export const app = express();

/** Authentication purpose */
app.use(cors({
    credentials: true,
}));

/** Enables Cookies and JSON data transfer */
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.set('trust proxy', true); //For proxy IPs use by true ip middleware 

export const server = http.createServer(app);

const port = process.env.PORT || 9000;

/**Server listening at port 9000 by default if port environment variable is null */
server.listen(port, ()=> {
    console.log('speak to me lord, your server is listening!'); 
})

/**MongoDB connection URL, if not specified in .env it will default to this*/
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://myAtlasDBUser:esMzzamVs0h6P6ti@myatlasclusteredu.5igbeds.mongodb.net/indicina_shortlink?retryWrites=true&w=majority';

/** Sync mongoose Promise with node's Promise
 * and connect to the local mongoDB.
 */
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL);
mongoose.connection.on('open', () => {
    process.env.MONGODB_URL ? console.log('Specified database connected!')
    : console.log('Default database connected!');
});
mongoose.connection.on('error', (error: Error) => console.log(error));

/** This is the root route. It is used to check if the server is running. */
app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({ alive: "True" });
  });
  
/* Telling the server to use the routes in the router object. */
app.use('/api/v1/', router());