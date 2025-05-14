# Binance Mock API

Simple Express.js API that returns mock cryptocurrency (BTC) price data similar to Binance format.

## Features

- Endpoint: `/api/prices`
- Random BTC price data between 1,000 and 10,000 USD
- 3 data points per day for the last 30 days
- Price changes for 1h, 24h, 7d, and 30d periods
- Ngrok integration for public access

## Setup

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode with auto-restart
npm run dev
```

Server runs on port 3000 by default (customize with PORT environment variable).

## Ngrok Integration

### Set up Ngrok Auth Token

1. Get token from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Set as environment variable or in `.env` file:
```
NGROK_AUTH_TOKEN=your_token_here
```

### Start with Ngrok

```bash
# CLI method
npm run tunnel

# Programmatic method (recommended)
npm run ngrok
```

## Setting Up Requestly Rules

### API URL Note

When setting up the rules below, pay attention to the API URL:
- Use `http://localhost:3000/api/prices` if accessing the mock API locally
- Use your ngrok URL (e.g., `https://xxxx-xxx-xxx.ngrok.io/api/prices`) if using ngrok

### Modify API Response Rule

To intercept and modify Binance API responses with mock data:

1. Install the [Requestly browser extension](https://requestly.io/downloads)
2. Create a new "Modify API Response" rule
3. Set the URL to: `https://www.binance.com/bapi/composite/v1/public/promo/cmc/cryptocurrency/quotes/historical`
4. Choose "Dynamic (JavaScript)" for Response Body
5. Paste the code from `requestly/mock-api-response.js`
6. Make sure your mock API server is running
7. Save and enable the rule

The script will fetch price data from your mock API and inject it into Binance API responses.

### Insert JavaScript Rule

To override Bitcoin price display on Binance:

1. Create a new "Insert Scripts" rule in Requestly
2. Set the URL to: `https://www.binance.com/en/price/bitcoin`
3. Choose Code Source: "CODE" and Insert: "After Page Load"
4. Language: "JS"
5. Paste the code from `requestly/insert-script.html`
6. Save and enable the rule

This script will fetch the latest price from your mock API and replace the displayed Bitcoin price on the Binance page.

## API Response Format

```json
{
  "code": "000000",
  "data": {
    "body": {
      "status": {
        "timestamp": "2023-05-14T11:04:31.021Z",
        "error_code": 0,
        "elapsed": 105
      },
      "data": {
        "symbol": "BTC",
        "name": "Bitcoin",
        "quotes": [
          {
            "timestamp": "2023-04-14T14:05:00.000Z",
            "quote": {
              "USD": {
                "percent_change_1h": 0.204,
                "percent_change_24h": 0.852,
                "percent_change_7d": -2.023,
                "percent_change_30d": -2.368,
                "price": 5872.28,
                "volume_24h": 2905044794,
                "market_cap": 116469181916,
                "circulating_supply": 19830000
              }
            }
          }
        ]
      }
    }
  }
} 