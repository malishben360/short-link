import * as crypto from 'crypto';

/** Define secret for crypto update */
const SECRET_KEY = process.env.SECRET_KEY || 'INDICINA-REST-API';

/** Generates random values */
export const random = () => crypto.randomBytes(128).toString('base64');

/** Authentication tokens */
export const authentication = (salt: string, password: string): string => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET_KEY).digest('hex');
}
