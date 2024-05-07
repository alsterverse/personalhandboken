export function parseRequestBody(stringBody, contentType) {
    try {
        if (!stringBody) {
            return "";
        }

        let result = {};

        if (contentType && contentType === "application/json") {
            return JSON.parse(stringBody);
        }

        let keyValuePairs = stringBody.split("&");
        keyValuePairs.forEach(function (pair) {
            let individualKeyValuePair = pair.split("=");
            result[individualKeyValuePair[0]] = decodeURIComponent(individualKeyValuePair[1] || "");
        });
        return JSON.parse(JSON.stringify(result));

    } catch {
        return "";
    }
}

export function generateReceiverEvent(payload) {
    return {
        body: payload,
        ack: async (response) => {
            return {
              statusCode: 200,
              body: response ?? ""
            };
        }
    };
}

export function isUrlVerificationRequest(payload) {
    if (payload && payload.type && payload.type === "url_verification") {
        return true;
    }
    return false;
}

export function getOpenAiResponse(text) {
    return text
}