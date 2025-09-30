require('dotenv').config();
require('./config/database');

setTimeout(() => {
  console.log('Debug complete');
  process.exit(0);
}, 3000);