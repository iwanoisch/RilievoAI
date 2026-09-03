import type {Context} from "@netlify/functions";

export default async (request: Request, _context: Context) => {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, x-api-key, anthropic-version",
            },
        });
    }

    if (request.method !== "POST") {
        return new Response("Method not allowed", {status: 405});
    }

    const body = await request.text();
    const apiKey = request.headers.get("x-api-key") || "";
    const anthropicVersion = request.headers.get("anthropic-version") || "2023-06-01";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": anthropicVersion,
            "anthropic-dangerous-direct-browser-access": "true",
        },
        body,
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
        status: response.status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
};

export const config = {
    path: "/api/anthropic/v1/messages",
};
