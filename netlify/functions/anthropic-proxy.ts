import type {Handler, HandlerEvent, HandlerContext} from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, x-api-key, anthropic-version",
            },
            body: "",
        };
    }

    if (event.httpMethod !== "POST") {
        return {statusCode: 405, body: "Method not allowed"};
    }

    const apiKey = event.headers["x-api-key"] || "";
    const anthropicVersion = event.headers["anthropic-version"] || "2023-06-01";

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": anthropicVersion,
                "anthropic-dangerous-direct-browser-access": "true",
            },
            body: event.body || "",
        });

        const responseBody = await response.text();

        return {
            statusCode: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: responseBody,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error instanceof Error ? error.message : "Proxy error"}),
        };
    }
};

export {handler};
