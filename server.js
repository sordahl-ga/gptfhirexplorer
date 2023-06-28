const express = require('express');
const morgan = require('morgan');
const path = require('path');

const DEFAULT_PORT = process.env.PORT || 3000;

// initialize express.
const app = express();

// Initialize variables.
let port = DEFAULT_PORT;
// Configure morgan module to log all requests.
app.use(morgan('dev'));

// Setup app folders.
//app.use(express.static('app'));
app.use(express.static('app', {
    setHeaders: function (res, path, stat) {
        // Encoding the value to base64
      const encodedValue = Buffer.from(process.env.NODE_CONFIG).toString('base64');
      res.set('Set-Cookie', "config=" + encodedValue +";Path=/") 
    }
  }));


// Set up a route for index.html
app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/app/index.html'));
});

// Start the server.
app.listen(port);

console.log(`Listening on port ${port}...`);