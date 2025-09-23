# ops-setup

A Node.js utility for configuring Azure Communication Services (ACS) Teams extension assignments through authenticated API calls.

## Overview

This tool automates the process of assigning Teams extension permissions to users in Azure Communication Services using HMAC-SHA256 authenticated API requests.

## Prerequisites

- Node.js (v14 or higher)
- Azure Communication Services resource
- Azure AD app registration with appropriate permissions
- Teams tenant ID and user object ID

## Setup

1. Clone this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment configuration:

   ```bash
   copy .env.example .env
   ```

4. Fill in your Azure configuration values in `.env`:
   - `ACS_API_KEY`: Your ACS resource API key
   - `ACS_ENDPOINT`: Your ACS resource endpoint URL
   - `TEAMS_TENANT_ID`: Your Azure AD tenant ID
   - `APP_ID`: Your Azure AD app registration client ID
   - `USER_OBJECT_ID`: The object ID of the user to assign permissions
   - `IsLocal`: (optional) Set to `true` for local development/testing

## Usage

Run the setup script:

```bash
npm start
```

The script will make an authenticated PUT request to assign Teams extension permissions for the specified user and app ID.
