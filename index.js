require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// today in bad ideas, not bothering with setting up a permanent DB
const storedUrls = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  let rawUrl = req.body.url;
  let url = new URL(rawUrl);
  dns.lookup(url.hostname, err => {
    if(err) {
      res.json({ error: 'invalid url' });
    } else {
      if(!storedUrls.includes(rawUrl))
        storedUrls.push(rawUrl);
      res.json({
        original_url: rawUrl,
        short_url: storedUrls.indexOf(rawUrl)
      });
    }
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  let id = req.params.id;
  if(id <= storedUrls.length)
    res.redirect(storedUrls[id]);
  else
    // not 100% sure how to handle this case... just redirect to root, I guess
    res.redirect('/');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
