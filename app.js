require('dotenv').config();

const express = require('express');
const path = require('path');

const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');
const { response } = require('express');

const app = express();


app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  const searchQuery = request.query.q;
  spotifyApi.searchArtists(searchQuery)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    const artists = data.items;
    response.render('artist-search-results', {
      searchQuery: searchQuery
  })
  //.catch(err => console.log('The error while searching artists occurred: ', err));
  });
});

app.get('/*', (request, response) => {
  response.render('error');
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
