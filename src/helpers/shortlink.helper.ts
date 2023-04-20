import * as crypto from 'crypto';

/** Return total visites */
export const getVisites = (stats: Array<any>) => {
    return stats.length;
}

/** Return last visited */
export const getLastVisitedAt = (stats: Array<any>) => {
    const sortedByCreatedAt = stats.sort((a, b) => b.created_at - a.created_at);
    return sortedByCreatedAt.length > 0 ? sortedByCreatedAt[0].created_at : null;
}

/** Return array of countries the short link is clicked from */
export const getCountryVisitsFromShortLinkPath = (stats: Array<any>) => {
    let countries = stats.reduce((prev, curr) => {
        let country = curr.country
        if (!prev[country]) prev[country] = 1
        else prev[country]++
        return prev
    }, {});
    return countries;
}

/** Return array of domains the short link was visited from */
export const getReferrerDomains = (stats: Array<any>) => {
    let referrers = stats.reduce((prev, curr) => {
        let domain = curr.referrer
        if (!prev[domain]) prev[domain] = 1
        else prev[domain]++
        return prev
    }, {});
    return referrers;
}

/** Define character set for encoding (A-Z, a-z, 0-9) */
const CHARSET = process.env.CHARSET || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Short code character creator
 * Return: short code characters
 */
export const generateShortCode = (url: string, userId: string) => {

    /** Generates an integer hash value for a long URL using SHA256 algorithm to uniquely identify it. */
    const updatedURL = url.concat(userId);
    const hash = crypto.createHash("sha256").update(updatedURL).digest("hex");
    const rand = parseInt(hash, 16);

    let shortCode = '';
    let remainder = rand;
    while (remainder > 0) {
        const digit = remainder % CHARSET.length;
        shortCode = CHARSET[digit] + shortCode;
        remainder = Math.floor(remainder / CHARSET.length);
    }

    return shortCode.slice(0, 6);
}

/** Define hosting domain
 * Default: http://short.est
*/
const DOMAIN_NAME = process.env.DOMAIN_NAME || 'http://short.est/';

/** Extracts the encoded component from original URL string */
export const extractEncodedComponent = (shortLink: string) => {
    const encodedComponent = shortLink.replace(DOMAIN_NAME, "");
    return encodedComponent;
}

/** Validate URL */
export const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
}

/** Extracts the domain name from a referrer URL. */
export const extractDomainFromReferrer = (referrer: string ) => {
    const referrerUrl = new URL(referrer);
    const domain = referrerUrl.hostname;
    return domain;
}  

/** Returns a random country code. */
export const generateRandomCountryCode = () => {
    const countries = ['US', 'SWZ', 'TUR', 'USA', 'GBR', 'NGA'];
    const rand = Math.ceil(Math.random() * 5);
    return countries[rand];
};

/** Generates a random HTTP referrer URL string that 
 * simulates a user coming from an external website. 
 * */
export const generateRandomReferrer = () => {
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
