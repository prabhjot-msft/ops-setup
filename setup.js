const axios = require("axios");
const CryptoJS = require("crypto-js");

// Optionally load from .env file
try {
    require('dotenv').config();
} catch (err) {
    // .env file not found or dotenv not available, continue with environment variables
}

let ACS_API_KEY = process.env.ACS_API_KEY || "<Your ACS API Key Here>";
let ACS_ENDPOINT = process.env.ACS_ENDPOINT || "<Your ACS Resource URL Here>";
let TEAMS_TENANT_ID = process.env.TEAMS_TENANT_ID || "<Your Teams Tenant ID Here>";
let APP_ID = process.env.APP_ID || "<Your App ID Here>";
let USER_OBJECT_ID = process.env.OBJECT_ID || "<Your Object ID Here>";
const isLocal = process.env.IsLocal === "true";

// Construct URL and host
const ACSUrl = new URL(ACS_ENDPOINT);
const ACSHostAndPort = ACSUrl.port ? `${ACSUrl.hostname}:${ACSUrl.port}` : ACSUrl.hostname;

// Request info
const method = "PUT";
const requestUrl = `${ACS_ENDPOINT}access/teamsExtension/tenants/${TEAMS_TENANT_ID}/assignments/${USER_OBJECT_ID}?api-version=2025-03-02-preview`;
const requestBody = {
    "principalType": "user",
    "tenantId": TEAMS_TENANT_ID,
    "clientIds": [
        APP_ID
    ],
    // "principalType": "teamsResourceAccount"
};

// Content hash
const contentHash = CryptoJS.enc.Base64.stringify(
    CryptoJS.SHA256(JSON.stringify(requestBody))
);

// Set host and key
let headers = {
    "Content-Type": "application/json",
    "x-ms-content-sha256": contentHash,
};

if (isLocal) {
    headers["x-ms-host"] = "foo.bar.com";
    APIKey = "test";
} else {
    headers["x-ms-host"] = ACSHostAndPort;
}

// Date
const utcNow = new Date().toUTCString();
headers["date"] = utcNow;

// Path + query string
const url = new URL(requestUrl);
const query = url.searchParams.toString();
const path = url.pathname + (query ? `?${query}` : "");

// Signature
const signedHeaders = "date;host;x-ms-content-sha256";
const stringToSign = `${method}\n${path}\n${utcNow};${ACSHostAndPort};${contentHash}`;
console.log("String to sign:", stringToSign);

// HMAC-SHA256
const signatureRawData = CryptoJS.enc.Utf8.parse(stringToSign);
const secretByteArray = CryptoJS.enc.Base64.parse(ACS_API_KEY);
const signatureBytes = CryptoJS.HmacSHA256(signatureRawData, secretByteArray);
const requestSignatureBase64String = CryptoJS.enc.Base64.stringify(signatureBytes);

// Authorization header
headers["Authorization"] = `HMAC-SHA256 SignedHeaders=${signedHeaders}&Signature=${requestSignatureBase64String}`;

// Send PUT request
axios
    .put(requestUrl, requestBody, { headers })
    .then((res) => {
        console.log("Response status:", res.status);
        console.log("Response data:", res.data);
    })
    .catch((err) => {
        console.error("Request failed:", err.response?.data || err.message);
    });
 

