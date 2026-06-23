import { WEB_APP_URL, COMMON, token } from "./config.js";

// 2. Create a generic fetch handler to handle GAS quirks
async function fetchFromGAS(action, params = {}) {
    try {
        // Construct the URL with query parameters (GAS loves GET requests)
        const url = new URL(WEB_APP_URL);
        url.searchParams.append('action', action);
        
        // Add any extra parameters
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        // Fetch from GAS
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        return await response.json();
    } catch (error) {
        console.error(`API Error (${action}):`, error);
        throw error; // Re-throw so your UI can handle it
    }
}

// 3. Export clean, API-style functions
export const api = {
    tokenCheck: (pageType) => tokenCheck(pageType),
    getLevels: () => getPatternLevels(),
    
    getPatternDetails: (patternId) => fetchFromGAS('getPattern', { id: patternId }),
    
    submitUserScore: (scoreData) => {
        // GAS requires specific setups for POST requests, but for simple apps,
        // people often send data via GET parameters or a stringified payload
        return fetchFromGAS('submitScore', { payload: JSON.stringify(scoreData) });
    }
};

async function getPatternLevels() {
    if(token){
        console.log("Fetching pattern levels with token:", token);
        try {
            let payload = {
                action: 'getPatternLevels',
                token: token,
                userIp: COMMON.ipaddress
            };
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error("Server returned status " + response.status);
            }
            const result = await response.json();

            if(result.status === 'ok'){
                return result.data; // Assuming the server returns the levels in result.data
            } else {
                throw new Error("Failed to fetch pattern levels: " + result.message);
            }
        } catch (err) {
            console.error("Failed to fetch pattern levels:", err);
            throw err;
        }
        
    }else{
        // throw new Error("User token is missing. Cannot fetch pattern levels.");
        console.error("User token is missing. Cannot fetch pattern levels.");
    }
}