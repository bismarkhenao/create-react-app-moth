const express = require('express');
const fallback = require('express-history-api-fallback');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(fallback('index.html', { root: path.join(__dirname, 'public') }));
app.listen(process.env.PORT || 3000);
