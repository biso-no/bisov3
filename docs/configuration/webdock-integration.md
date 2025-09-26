# Webdock Integration Setup

This document describes how to set up Webdock API integration for server monitoring in your admin dashboard using the official Webdock SDK.

## Prerequisites

1. A Webdock account with active servers
2. API access to your Webdock account
3. Node.js and bun package manager

## Installation

First, install the official Webdock SDK:

```bash
bun install @webdock/sdk
```

## Configuration

### 1. Get Your Webdock API Key

1. Log in to your Webdock dashboard: https://app.webdock.io/
2. Navigate to API settings
3. Generate or copy your API key

### 2. Set Environment Variable

Add the following environment variable to your `.env.local` file:

```bash
WEBDOCK_API_KEY=your_webdock_api_key_here
```

**Important**: Never commit your actual API key to version control. Always use environment variables for sensitive credentials.

### 3. Restart Your Application

After adding the environment variable, restart your development server:

```bash
bun dev
```

## Features

The Webdock integration provides the following features in your admin dashboard:

### Analytics Tab

- **Server Overview Cards**: Total servers, average CPU/Memory usage
- **Resource Usage Chart**: Real-time CPU, Memory, and Disk usage by server
- **Server Status Table**: Current status of all servers

### Notifications Tab

- **Alert Summary Cards**: Critical alerts, active alerts, offline servers
- **Server Alerts**: Real-time alerts from Webdock servers with severity indicators
- **System Alerts**: Combined view of application and server notifications

## SDK Integration

The integration uses the official [Webdock Node.js SDK](https://github.com/webdock-io/nodejs-sdk) which provides:

- Type-safe API wrapper
- Go-style error handling
- Automatic request/response handling
- Built-in TypeScript support

### Available Methods

Currently implemented:
- `client.servers.list()` - List all servers

### Planned Features

The following features will be implemented as the SDK expands:
- Server metrics and monitoring data
- Alert management
- Bandwidth usage tracking
- Server management operations

## Error Handling

The integration includes robust error handling using the SDK's Go-style approach:

- API failures gracefully degrade to mock data for development
- SDK handles connection timeouts and network errors
- Invalid API keys show warning messages in console
- Fallback to demo data when API is unavailable
- All errors are logged for debugging

## Troubleshooting

### No Data Showing

1. Verify your API key is correct
2. Check that the environment variable is set properly
3. Ensure your Webdock account has active servers
4. Check browser console for error messages

### API Rate Limiting

The integration includes caching to prevent excessive API calls. If you encounter rate limiting:

1. Data is cached for 5 minutes by default
2. Consider increasing cache duration in production
3. Contact Webdock support if limits are too restrictive

## Security Considerations

- API keys are stored as server-side environment variables only
- No sensitive data is exposed to the client-side
- All API calls are made from server actions
- Implement proper access controls for admin dashboard access
