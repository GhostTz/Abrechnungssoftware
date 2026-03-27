require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || 'localhost';

// Serve static files from the webserver directory
app.use(express.static(path.join(__dirname, 'src/webserver')));

// Route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/webserver/html/main.html'));
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
