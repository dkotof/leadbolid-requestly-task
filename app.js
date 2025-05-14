const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes and origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Function to generate random number between min and max
const getRandomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate price data for the last month (30 days)
const generatePriceData = () => {
  // Initialize the quotes array
  const quotes = [];
  
  // Current date
  const now = new Date();
  
  // Generate data for last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create 3 entries per day (morning, afternoon, evening)
    for (let j = 0; j < 3; j++) {
      const hours = j * 8 + 6; // 6am, 2pm, 10pm
      date.setHours(hours, 0, 0, 0);
      
      const price = getRandomPrice(1000, 10000);
      const percentChange1h = ((Math.random() * 2) - 1) * 2; // Between -2% and 2%
      const percentChange24h = ((Math.random() * 4) - 2) * 2; // Between -4% and 4%
      const percentChange7d = ((Math.random() * 6) - 3) * 2; // Between -6% and 6%
      const percentChange30d = ((Math.random() * 10) - 5) * 2; // Between -10% and 10%
      const volume24h = getRandomPrice(100000000, 5000000000);
      const marketCap = price * 19830000; // Simplified market cap calculation
      const timestamp = date.toISOString();
      
      quotes.push({
        timestamp: timestamp,
        quote: {
          USD: {
            percent_change_30d: percentChange30d,
            circulating_supply: 19830000,
            percent_change_1h: percentChange1h,
            percent_change_24h: percentChange24h,
            market_cap: marketCap,
            total_supply: 19830000,
            price: price,
            volume_24h: volume24h,
            percent_change_7d: percentChange7d,
            timestamp: timestamp
          }
        }
      });
    }
  }
  
  // Build the final response object
  const data = {
    code: "000000",
    message: null,
    messageDetail: null,
    data: {
      body: {
        data: {
          symbol: "BTC",
          is_active: 1,
          name: "Bitcoin",
          id: 1,
          is_fiat: 0,
          quotes: quotes
        },
        status: {
          timestamp: new Date().toISOString(),
          error_code: 0,
          error_message: null,
          elapsed: 105,
          credit_count: 8,
          notice: "You have used 109% of your plan's monthly credit limit."
        }
      }
    }
  };
  
  return data;
};

// Generate price data once at startup
const priceData = generatePriceData();
console.log(`Price data generated with ${priceData.data.body.data.quotes.length} entries`);

// API endpoint that returns the cached price data
app.get('/api/prices', (req, res) => {
  // Update the timestamp in the status to current time
  priceData.data.body.status.timestamp = new Date().toISOString();
  res.json(priceData);
});

// Start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for use in other files
module.exports = { app, generatePriceData, PORT }; 