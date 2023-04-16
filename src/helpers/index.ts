import crypto from 'crypto';

/** Define secret for crypto update */
const SECRET = process.env.SECRET || 'INDICINA-REST-API';

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
    const hash = crypto.createHash("sha256").update(longURL).digest("hex");
    const rand = parseInt(hash, 16);
    // Convert the random number to base-62 using CHARSET
    let encoded = '';
    let remainder = rand;
    while (remainder > 0) {
        const digit = remainder % CHARSET.length;
        encoded = CHARSET[digit] + encoded;
        remainder = Math.floor(remainder / CHARSET.length);
    }

    return encoded;
}

/** Encoded  characters extractor
 * Return: encoded characters
 */
export const extractEncoded = (shortURL: string) => {

    // Extract the encoded characters from the long URL
    const encoded = shortURL.replace(/^http:\/\/localhost:9000\/api\/v1\//, "");

    return encoded;
}
