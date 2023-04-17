import crypto from 'crypto';

/** Define hosting domain
 * Default: http://short.est
*/
export const DOMAIN = process.env.DOMAIN || 'http://short.est/';

/** Define character set for encoding (A-Z, a-z, 0-9) */
const CHARSET = process.env.CHARSET || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Return total clicks */
export const getClicks = (stats: Array<any>) => {
    return stats.length;
}

/** Return array of countries the short url is click from */
export const getCountries = (stats: Array<any>) => {
    let countries = stats.reduce((prev, curr) => {
        let country = curr.country
        if (!prev[country]) prev[country] = 1
        else prev[country]++
        return prev
    }, {});
    return countries;
}

/** Return array of domains the short url is click from */
export const getReferrers = (stats: Array<any>) => {
    let referrers = stats.reduce((prev, curr) => {
        let domain = curr.referrer
        if (!prev[domain]) prev[domain] = 1
        else prev[domain]++
        return prev
    }, {});
    return referrers;
}

/** Encoded character creator
 * Return: encoded characters
 */
export const encodeURL = (longURL: string) => {

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

export const extractDomainFromReferrer = (referrer: string ) => {
    const referrerUrl = new URL(referrer);
    const domain = referrerUrl.hostname;
    return domain;
}  

/** These fake values are generate because the app is runing
 * locally and it can't access remote IP addresses.
 * The implementation is commented for true IP addresses.
 */

/** Fake countries */
export const randomCountry = () => {
    const countries = ['US', 'SWZ', 'TUR', 'USA', 'GBR', 'NGA'];
    const rand = Math.ceil(Math.random() * 5);
    return countries[rand];
};
/** Fake referrers */
export const randomReferrers = () => {
    const referrers = [
        'https:indicina.co',
        'https://google.com',
        'https://linkedin.com', 
        'https://twitter.com', 
        'https://instangram.com', 
        'https://tylara.com'
    ];
    const rand = Math.ceil(Math.random() * 5);
    return referrers[rand];
};
