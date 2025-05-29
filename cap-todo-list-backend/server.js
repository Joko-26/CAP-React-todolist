const cds = require('@sap/cds');
const cors = require('cors');

cds.on('bootstrap', app => {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // falls du Cookies/Auth brauchst
  }));
});

cds.on('listening', () => {
  console.log('CAP server is listening...');
});

module.exports = cds.server;