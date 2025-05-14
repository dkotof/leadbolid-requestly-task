require('dotenv').config();
const ngrok = require('ngrok');
const { app, PORT } = require('./app');

// Start the server and connect to ngrok
const startServer = async () => {
  try {
    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Set up ngrok auth token - replace NGROK_AUTH_TOKEN with your actual token
    // You can also set this as an environment variable: process.env.NGROK_AUTH_TOKEN
    const authToken = process.env.NGROK_AUTH_TOKEN;
    if (authToken) {
      await ngrok.authtoken(authToken);
      console.log('Ngrok auth token set successfully');
    } else {
      console.log('Warning: No ngrok auth token provided. Using limited features.');
      console.log('Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken');
    }

    // Connect to ngrok
    const url = await ngrok.connect({
      addr: PORT,
      onStatusChange: status => {
        console.log(`Ngrok status changed to: ${status}`);
      },
      onLogEvent: data => {
        console.log(`Ngrok log event: ${data}`);
      }
    });

    console.log(`Ngrok tunnel is active at: ${url}`);
    console.log(`You can access the API at: ${url}/api/prices`);

    // Handle process termination
    const cleanup = async () => {
      console.log('Closing ngrok tunnel and shutting down server...');
      await ngrok.kill();
      server.close();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (error) {
    console.error('Error starting server with ngrok:', error);
    await ngrok.kill();
    process.exit(1);
  }
};

// Start the server with ngrok
startServer(); 