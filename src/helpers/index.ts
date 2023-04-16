import crypto from 'crypto';

/** Define secret for crypto update */
const SECRET = process.env.SECRET || 'INDICINA-REST-API';

/** Define hosting domain
 * Default: http://short.est
*/
export const DOMAIN = process.env.SECRET || 'http://short.est/';

/** Define character set for encoding (A-Z, a-z, 0-9) */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Generates random values */
export const random = () => crypto.randomBytes(128).toString('base64');

/** Authentication tokens */
export const authentication = (salt: string, password: string): string => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

/** Encoded character creator
 * Return: encoded characters
 */
export const encodeURI = (longURL: string) => {

    // Hash the long URL using SHA256 to get an integer value
    const updatedURL = longURL.concat(Date.now().toString());
    const hash = crypto.createHash("sha256").update(updatedURL).digest("hex");
    const rand = parseInt(hash, 16);
    // Convert the random number to base-62 using CHARSET
    let encoded = '';
    let remainder = rand;
    while (remainder > 0) {
        const digit = remainder % CHARSET.length;
        encoded = CHARSET[digit] + encoded;
        remainder = Math.floor(remainder / CHARSET.length);
    }

    return encoded.slice(0, 6);
}

/** Encoded  characters extractor
 * Return: encoded characters
 */
export const extractEncoded = (shortURL: string) => {

    // Extract the encoded characters from the long URL
    const encoded = shortURL.replace(DOMAIN, "");

    return encoded;
}
