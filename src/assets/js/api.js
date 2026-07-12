import { WEB_APP_URL, COMMON, token } from "./config.js";

// 3. Export clean, API-style functions
export const api = {
    tokenCheck: (pageType) => tokenCheck(pageType),
    getLevels: () => getPatternLevels(),
    getPatternList: () => getPatternList()
};

const getExamples = (examplesString) => {
    let examplesArray = [];
    if (!examplesString) return examplesArray;
    const examples = JSON.parse(examplesString).map(example => example.split('---'));
    examples.forEach(example => {
        const en = example[0];
        const ja = example[1];
        const my = example[2];
        examplesArray.push({ en, ja, my });
    });
    return examplesArray;
};

async function saveToGAS(action, data) {
    try {

        const payload = {
            action: action,
            token: token,
            userIp: COMMON.ipaddress,
            data: data
        };

        console.log("Saving data to GAS with payload:", payload);
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        console.log("Response from GAS:", response);

        if (!response.ok) {
            throw new Error("Server returned status " + response.status);
        }

        const result = await response.json();

        if (result.status === 'ok') {
            return result.latestId; // Assuming the server returns the saved data in result.data
        } else {
            console.error("Failed to save data:", result.message);
            throw new Error("Failed to save data: " + result.message);
        }
    } catch (err) {
        console.error("Error in saveToGAS:", err);
        console.error("Failed to save data:", err);
        throw err;
    }
}

async function getPatternLevels() {
    if(token){
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

async function getPatternList() {
    if(token){
        try {
            let payload = {
                action: 'getPatternList',
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
                const data = result.data;
                let patternInfoList = [];
                patternInfoList = data.map(entry => {
                    return {
                        "id": entry[0],
                        "level": entry[1],
                        "title": entry[2],
                        "formula": entry[3],
                        "explanation": { "en": entry[4], "ja": entry[5], "my": entry[6] },
                        "examples": getExamples(entry[7]),
                        "created_at": entry[8],
                    };
                });
                return patternInfoList;
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